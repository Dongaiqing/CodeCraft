class Queries():
    @staticmethod
    def insertIntoQuestionCode():
        return 'INSERT INTO QuestionCode(title, article, answer, totalRating, numRating, author) VALUES (%s,%s,%s,%s,%s,%s);'
    @staticmethod
    def tryLogin():
        return 'SELECT * FROM UserProfile WHERE username=%s AND password=%s'
    @staticmethod
    def lookupLoginExists():
        return 'SELECT * FROM UserProfile WHERE username=%s'
    @staticmethod
    def insertIntoRegister():
        return 'INSERT INTO UserProfile(username, useremail, password, userPicSource, correctQuestionCount, commentCount, uploadQuestionCount, uploadTestCaseCount, eBucks, userLevel) VALUES(%s, %s, %s, %s,%s, %s, %s, %s,%s, %s)'
    @staticmethod
    def getQuestionFuzzy():
        return 'SELECT * FROM QuestionCode WHERE title LIKE %s OR article LIKE %s'

    @staticmethod
    def getQuestion():
        return 'SELECT * FROM QuestionCode WHERE title=%s'
    @staticmethod
    def storeQuestionAnswer():
        return 'INSERT INTO QuestionSubmission(sourceCode, sourceLanguage, userID, questionID, result) VALUES (%s,%s,(SELECT id FROM UserProfile WHERE username=%s),%s,%s)'
    @staticmethod
    def updateQuestionAnswer():
        return 'UPDATE QuestionSubmission SET sourceCode=%s, result=%s, sourceLanguage=%s WHERE userID=(SELECT id FROM UserProfile WHERE username=%s) AND questionID=%s'
    @staticmethod
    def getAllRoadmapTopLevelComments():
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM RoadMap_Comments WHERE roadmapID = %s) AND Comments.id in (SELECT commentsID FROM Comments_Comments)'
    @staticmethod
    def getAllRoadmapSecondLevelComments():
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM RoadMap_Comments WHERE roadmapID = %s) AND Comments.id in (SELECT secondaryCommentsID FROM Comments_Comments WHERE Comments_Comments.commentsID = %s)'

    @staticmethod
    def getAllQuestionTopComments():
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM QuestionCode_Comments WHERE questionID = %s) AND Comments.id not in (SELECT secondaryCommentsID FROM Comments_Comments)'
    @staticmethod
    def getAllQuestionSecondLevelComments():
        return 'SELECT * FROM Comments WHERE Comments.id in (SELECT commentsID FROM QuestionCode_Comments WHERE questionID = %s) AND Comments.id in (SELECT secondaryCommentsID FROM Comments_Comments WHERE Comments_Comments.commentsID = %s)'
    @staticmethod
    def insertIntoComments():
        return 'INSERT INTO Comments(imageSource, username, comment, upvoteNum, downvoteNum) VALUES(%s, %s, %s, %s, %s)'
    @staticmethod
    def insertIntoSubComments():
        return 'INSERT INTO Comments_Comments(commentsID, secondaryCommentsID) VALUES((SELECT id FROM Comments WHERE id=%s), (SELECT id FROM Comments WHERE id=%s))'
    @staticmethod
    def insertIntoRoadMap_Comments():
        return 'INSERT INTO RoadMap_Comments(roadmapID, commentsID) VALUES((SELECT id FROM RoadMap WHERE id=%s), (SELECT id FROM Comments WHERE id=%s))'
    @staticmethod
    def insertIntoQuestionCode_Comments():
        return 'INSERT INTO QuestionCode_Comments(questionID, commentsID) VALUES((SELECT id FROM QuestionCode WHERE id=%s), (SELECT id FROM Comments WHERE id=%s))'
    @staticmethod
    def getCommentID():
        return 'SELECT id FROM Comments WHERE Comments.imageSource=%s AND Comments.username=%s AND Comments.comment=%s'
    @staticmethod
    def getQuestionRating():
        return 'SELECT totalRating, numRating FROM QuestionCode WHERE id=%s'
    @staticmethod
    def getRoadmapRating():
        return 'SELECT totalRating, numRating FROM RoadMap WHERE id=%s'
    @staticmethod
    def updateQuestionRating():
        return 'UPDATE QuestionCode SET totalRating=%s, numRating=%s WHERE id=%s'
    @staticmethod
    def updateRoadmapRating():
        return 'UPDATE RoadMap SET totalRating=%s, numRating=%s WHERE id=%s'
    @staticmethod
    def getQuestionTags():
        return 'SELECT tag FROM QuestionCode_Tag WHERE questionID=%s;'
    @staticmethod
    def insertQuestionTag():
        return 'INSERT INTO QuestionCode_Tag(questionID, tag) VALUES((SELECT id FROM QuestionCode WHERE id=%s), %s)'
    @staticmethod
    def getUserProfile():
        return 'SELECT * FROM UserProfile WHERE username=%s'
    @staticmethod
    def updateUserProfilecommentCount():
        return 'UPDATE UserProfile SET commentCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfileuploadQuestionCount():
        return 'UPDATE UserProfile SET uploadQuestionCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfileuploadTestCaseCount():
        return 'UPDATE UserProfile SET uploadTestCaseCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfilecorrectQuestionCount():
        return 'UPDATE UserProfile SET correctQuestionCount=%s WHERE id=%s'
    @staticmethod
    def updateUserProfileuseremail():
        return 'UPDATE UserProfile SET useremail=%s WHERE id=%s'
    @staticmethod
    def updateUserProfilepassword():
        return 'UPDATE UserProfile SET password=%s WHERE id=%s'
    @staticmethod
    def insertTestcases():
        return 'INSERT INTO QuestionCode_Testcases(questionID, testcase) VALUES((SELECT id FROM QuestionCode WHERE id=%s), %s)'
    @staticmethod
    def getAllRoadmap():
        return 'SELECT * FROM RoadMap'
    @staticmethod
    def updateRoadmapUpvote():
        return 'UPDATE RoadMap SET upvoteNum=%s WHERE id=%s'
    @staticmethod
    def updateRoadmapDownvote():
        return 'UPDATE RoadMap SET downvoteNum=%s WHERE id=%s'
    @staticmethod
    def insertUserProfile_RoadMap():
        return 'INSERT INTO UserProfile_RoadMap(userID, roadmapID) VALUES((SELECT id FROM UserProfile WHERE username=%s), (SELECT id FROM RoadMap WHERE id=%s))'
    @staticmethod
    def deleteUserProfile_RoadMap():
        return 'DELETE FROM UserProfile_RoadMap WHERE userID=(SELECT id FROM UserProfile WHERE username=%s) AND roadmapsID=%s'
    @staticmethod
    def getAllUserProfile_RoadMap():
        return 'SELECT * FROM UserProfile_RoadMap WHERE userID=(SELECT id FROM UserProfile WHERE username=%s)'
    @staticmethod
    def insertRoadMap():
        return 'INSERT INTO RoadMap(description, graphData, title, userID, upvoteNum, downvoteNum, totalRating, numRating) VALUES(%s,%s,%s,(SELECT id FROM UserProfile WHERE username=%s),%s,%s,%s,%s)'
    @staticmethod
    def getRoadMapID():
        return 'SELECT id FROM RoadMap WHERE description=%s AND graphData=%s AND title=%s'