import csv

# replace filename with appropriate output
output = open('encampment-cleaned.csv', 'wb')
writer = csv.writer(output, delimiter=",")

# same here, replace filename with appropriate input
with open('../../data/encampments-map-2017/encampment.csv') as f:
	reader = csv.reader(f)
	first_line = reader.next()
	# first_line.insert(2, 'YearOpened')
	writer.writerow(first_line)
	# print first_line
	for row in reader:
		# year = row[1][6:10]
		# row.insert(2, year)
		row[10] = 'encampment'
		if row[15] != '0':
			writer.writerow(row)
