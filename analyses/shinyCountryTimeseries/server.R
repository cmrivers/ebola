# server.R

library(RCurl)
library(ggplot2)
library(stringr)
library(reshape2)
library(magrittr)
library(dplyr)
library(scales)
library(shiny)

data <- getURL("https://raw.githubusercontent.com/cmrivers/ebola/master/country_timeseries.csv")
df <- read.csv(text = data)

df1.noDate <- df[, !names(df) %in% c("Date")]
day <- c(0:df1.noDate[1, 1])
df3.merge <- data.frame(day)

for(i in 2:ncol(df1.noDate)){
  df.temp <- df1.noDate[, c(1, i)]
  df.temp <- na.omit(df.temp)
  last <- nrow(df.temp)
  last
  df.temp[last,1]
  day.offset <- df.temp[last,1]
  df.temp$day.adj <- df.temp$Day - day.offset
  df.temp
  df3.merge <- merge(x = df3.merge, y = df.temp[, names(df.temp) != "Day"],
                     by.x = "day", by.y = "day.adj", all.x = TRUE)
}

row.names(df3.merge) <- df3.merge$day
df3.merge <- df3.merge[, names(df3.merge) != "day"]

df4 <- df3.merge %>%
    as.matrix() %>%
        t() %>%
            as.data.frame()
vars <- colsplit(row.names(df4), "_", c("type", "place"))
df4 <- cbind(vars, df4)
row.names(df4) <- NULL

df5.melt <- melt(df4)
names(df5.melt) <- c("type", "place", "day", "count")
df5.melt$type[df5.melt$type == "Case"] <- "Cases"



shinyServer(function(input, output) {

  data.plot <- reactive({
    df.plot <- df5.melt[!is.na(df5.melt$count), ]
    all <- c("Guinea", "Liberia", "SierraLeone", "Nigeria", "Senegal")
    if(input$countries == "All"){selection <- all}
    else{selection <- input$countries}
    df.plot <- df.plot[df.plot$place %in% selection, ]
  })

  plot <- reactive({
    g <- ggplot(data = data.plot(),
                aes(x = as.numeric(day), y = as.numeric(count),
                    group = place, color = place)) +
                        geom_point() + geom_line()+
                            facet_grid(~ type) +
                                scale_x_continuous(name="Days after first report") +
                                    scale_y_continuous(name="Counts") +
                                        ggtitle("Number of obserations for days after first report")

    if(!input$log){
      return(g)
    } else{
      h <- g + scale_y_continuous(trans=log10_trans()) +
          scale_y_log10(name="Counts") +
              ggtitle("Number of obserations for days after first report (log10 scale)")
      return(h)
    }
  })

  output$plot <- renderPlot({
    print(plot())
  })
})
