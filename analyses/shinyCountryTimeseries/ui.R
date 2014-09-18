# ui.R
library(shiny)

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
                  br(),
                  "To run this application, browse to the parent directory of where the ui.R and server.R scripts, open up R
such that the ",
                  code("getwd()"),
                  "is the parent directory.  Then load shiny, by using ",
                  code("library(shiny)"),
                  "and then launch the application by typing",
                  code('runApp("shiny-country-timeseries")'),

                  p("the app requires the following R packages to be installed: RCurl, ggplot2, stringr, reshape2, dplyr, scales, shiny"),

                  plotOutput("plot")
                  )
        )
))
