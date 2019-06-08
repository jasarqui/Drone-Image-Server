#!/usr/bin/python3
import random

# temporary
# data
rice_yield = random.randint(50, 80)
days_before_harvest = random.randint(10, 50)

# write to file
f = open("src/entities/img/utils/rice_data.txt", "w")
f.write(str(rice_yield) + '\n' + str(days_before_harvest))
f.close()