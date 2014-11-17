# ui.R
library(shiny)

shinyUI(fluidPage(
    titlePanel("Plotting Ebola"),

    tags$head(includeScript("google-analytics.js")),

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

                  plotOutput("plot")
                  )
        )
))
