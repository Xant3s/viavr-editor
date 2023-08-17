import os
import csv
import shutil


# set the path of the CSV file
csv_path = './DummyDatasets/template_dataset.csv'

parent_dir = './Templates'

# open the CSV file
with open(csv_path, 'r') as csvfile:
    # create a csv reader object
    csvreader = csv.DictReader(csvfile)
    # loop through each row in the CSV file
    for row in csvreader:
        # get the folder name from the 'link' column of the row
        folder_name = row['keyword']
        # create the full path to the new folder
        new_folder_path = os.path.join(parent_dir, folder_name)
        # check if the folder already exists
        if os.path.exists(new_folder_path):
            # delete the existing folder
            shutil.rmtree(new_folder_path)
        # create the directory with the folder name
        os.makedirs(new_folder_path)