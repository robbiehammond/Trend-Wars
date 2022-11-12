import pandas as pd
import random

class wordlibrary:
    def __init__(library_path):
        self.word_df = pd.read_csv(library_path):
        self.word_list = word_df["Word"].tolist()

    def get_word():
        return random.choice(self.word_list)


    def add_word(word):
        self.word_list.append(word)

    def remove_word(word):
        if word in self.word_list:
            self.word_list.delete(word)
    