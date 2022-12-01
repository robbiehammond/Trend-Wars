from BigHeadOptions import accessory, body, circleColor, clothing, clothingColor, eyebrows, eyes, facialHair, graphic, hair, hairColor, hat, hatColor, lashes, lipColor, mouth, skinTone
import random

class BigHead:
    def __init__(self):
        self.accessory = random.choice(accessory)
        self.body = random.choice(body)
        self.circleColor = random.choice(circleColor)
        self.clothing = random.choice(clothing)
        self.clothingColor = random.choice(clothingColor)
        self.eyebrows = random.choice(eyebrows)
        self.eyes = random.choice(eyes)
        self.facialHair = random.choice(facialHair)
        self.graphic = random.choice(graphic)
        self.hair = random.choice(hair)
        self.hairColor = random.choice(hairColor)
        self.hat = random.choice(hat)
        self.hatColor = random.choice(hatColor)
        self.lashes = random.choice(lashes)
        self.lipColor = random.choice(lipColor)
        self.mask = random.choice([True, False]),
        self.faceMask = random.choice([True, False]),
        self.mouth = random.choice(mouth)
        self.skinTone = random.choice(skinTone)

    def toJSON(self):
        return {
            "accessory": self.accessory,
            "body": self.body,
            "circleColor": self.circleColor,
            "clothing": self.clothing,
            "clothingColor": self.clothingColor,
            "eyebrows": self.eyebrows,
            "eyes": self.eyes,
            "facialHair": self.facialHair,
            "graphic": self.graphic,
            "hair": self.hair,
            "hairColor": self.hairColor,
            "hat": self.hat,
            "hatColor": self.hatColor,
            "lashes": self.lashes,
            "lipColor": self.lipColor,
            "mask": self.mask,
            "faceMask": self.faceMask,
            "mouth": self.mouth,
            "skinTone": self.skinTone
        }

class Player:
    def __init__(self, id, username, ready):
        self.id = id
        self.lobbyID = None
        self.username = username
        self.ready = ready
        self.guessedWord = None # will be overrided with their guessed word during the game 
        self.score = 0
        self.bestWord = ""
        self.mostPointsFromWord = -1
        self.rank = -1 #overriden at the end of the game
        self.BigHead = BigHead()

    # encode a player (in json) to be sent to frontend
    # also not sure if we'll ever need this 
    def toJSON(self):
        return {
            "id": self.id,
            "username": self.username,
            "ready": self.ready,
            "score": int(self.score),
            "wordSubmittedThisTurn": False if self.guessedWord == None else True,
            "bestWord": self.bestWord,
            "rank": self.rank,
            "bigHead": self.BigHead.toJSON()
        }

    def __str__(self):
        return f'Player: {self.id}, {self.username}, {self.ready}'

    # decode a player object sent to the server via json into a Player object
    # not sure if we'll ever need to use use this
    @staticmethod
    def fromJSON(json):
        pass