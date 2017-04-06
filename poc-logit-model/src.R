# http://stats.idre.ucla.edu/r/dae/logit-regression/
data <- read.csv("http://www.ats.ucla.edu/stat/data/binary.csv")
data$rank <- as.factor(data$rank)

fit <- glm(admit ~ ., data = data, family = "binomial")

#newdata <- data.frame(gre = max(data$gre), gpa = max(data$gpa), rank = c("1", "2"))
#predict(fit, newdata = newdata, type = "response")

saveRDS(fit, "admission.rds")


fit <- readRDS('admission.rds')
