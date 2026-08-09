FROM rocker/r-ver:4.4.2

WORKDIR /app

RUN Rscript -e "install.packages(c('data.table', 'httr2', 'janitor', 'jsonlite', 'lubridate', 'stringr'), repos = 'https://cloud.r-project.org')"

COPY refresh_realtime_crowd.R /app/refresh_realtime_crowd.R

CMD ["Rscript", "/app/refresh_realtime_crowd.R"]
