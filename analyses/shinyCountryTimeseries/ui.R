# ui.R
library(shiny)

googleAnalytics <- function(account="UA-36850640-1"){
  HTML(paste("<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-54964509-1', 'auto');
  ga('send', 'pageview');

</script>", sep=""))
}


shinyUI(fluidPage(
    titlePanel("Plotting Ebola"),

    sidebarLayout(
        sidebarPanel("Interactive plot components",

                     checkboxGroupInput("countries",
                                        label = h3("Countries to display"),
                                        choices = c("Guinea" = "Guinea",
                                            "Liberia" = "Liberia",
                                            "Sierra Leone" = "SierraLeone",
                                            "Nigeria" = "Nigeria",
                                            "Senegal" = "Senegal",
                                            "All" = "All"),
                                        selected = "All"),
                     checkboxInput("log", "Plot y-axis on log scale")
                     ),

        mainPanel(p("This graphs the cases and deaths of each country and normalizes the onset dates all to '0' so countries can be compared"),
                  "Data was all taken from Caitlin River's 'ebola' repository",
                  a('here', href = 'https://github.com/cmrivers/ebola'),

                  plotOutput("plot"),

                  googleAnalytics()
                  )
        )
))
