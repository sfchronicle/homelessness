import csv

# replace filename with appropriate output
output = open('alldata311_cleaned.csv', 'wb')
writer = csv.writer(output, delimiter=",")

# same here, replace filename with appropriate input
with open('../../data/encampments-map-2017/311_for_interactive.csv') as f:
	reader = csv.reader(f)
	first_line = reader.next()
	first_line.insert(10, 'CategoryID')
	writer.writerow(first_line)
	# print first_line
	for row in reader:
		category_group = row[9]
		print category_group
		if category_group == "Encampment":
			row.insert(10, "encampment")
		elif category_group == "Human Waste":
			row.insert(10, "waste")
		elif category_group == "Needles":
			row.insert(10, "needle")
		# row.insert(2, year)
		# row[10] = 'encampment'
		if row[15] != '0':
			writer.writerow(row)
