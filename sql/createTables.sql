CREATE TABLE IF NOT EXISTS UserProfile(
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(1000) UNIQUE,
  useremail VARCHAR(1000),
  password VARCHAR(1000),
  userPicSource VARCHAR(2000),
  correctQuestionCount INT,
  commentCount INT,
  uploadQuestionCount INT,
  uploadTestCaseCount INT,
  eBucks INT,
  userLevel INT
);

CREATE TABLE IF NOT EXISTS UserProfile_Items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userID INT,
  itemStr VARCHAR(1000),
  FOREIGN KEY (userID) REFERENCES UserProfile(id)
);

CREATE TABLE IF NOT EXISTS UserProfile_Friends (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userID INT,
  friendName VARCHAR(1000),
  FOREIGN KEY (userID) REFERENCES UserProfile(id),
  FOREIGN KEY (friendName) REFERENCES UserProfile(username)
);

CREATE TABLE IF NOT EXISTS QuestionCode (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(1000),
  article VARCHAR(2000),
  answer VARCHAR(2000),
  totalRating INT,
  numRating INT,
  author VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS QuestionCode_Tag (
  id INT PRIMARY KEY AUTO_INCREMENT,
  questionID INT,
  tag VARCHAR(1000),
  FOREIGN KEY (questionID) REFERENCES QuestionCode(id)
);

CREATE TABLE IF NOT EXISTS QuestionSubmission (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sourceCode VARCHAR(2000),
  sourceLanguage VARCHAR(1000),
  userID INT,
  questionID INT,
  result VARCHAR(2000),
  FOREIGN KEY (userID) REFERENCES UserProfile(id),
  FOREIGN KEY (questionID) REFERENCES QuestionCode(id)
);

CREATE TABLE IF NOT EXISTS RoadMap (
  id INT PRIMARY KEY AUTO_INCREMENT,
  description VARCHAR(2000),
  graphData VARCHAR(2000),
  title VARCHAR(1000),
  userID INT,
  upvoteNum INT,
  downvoteNum INT,
  totalRating INT,
  numRating INT,
  FOREIGN KEY (userID) REFERENCES UserProfile(id)
);

CREATE TABLE IF NOT EXISTS Comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  imageSource VARCHAR(2000),
  username VARCHAR(1000),
  comment VARCHAR(2000),
  upvoteNum INT,
  downvoteNum INT
);

CREATE TABLE IF NOT EXISTS Comments_Comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  commentsID INT,
  secondaryCommentsID INT,
  FOREIGN KEY (commentsID) REFERENCES Comments(id),
  FOREIGN KEY (secondaryCommentsID) REFERENCES Comments(id)
);

CREATE TABLE IF NOT EXISTS QuestionCode_Comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  questionID INT,
  commentsID INT,
  FOREIGN KEY (questionID) REFERENCES QuestionCode(id),
  FOREIGN KEY (commentsID) REFERENCES Comments(id)
);

CREATE TABLE IF NOT EXISTS RoadMap_Comments(
  id INT PRIMARY KEY AUTO_INCREMENT,
  roadmapID INT,
  commentsID INT,
  FOREIGN KEY (roadmapID) REFERENCES RoadMap(id),
  FOREIGN KEY (commentsID) REFERENCES Comments(id)
);

CREATE TABLE IF NOT EXISTS QuestionCode_Testcases(
  id INT PRIMARY KEY AUTO_INCREMENT,
  questionID INT,
  testcase VARCHAR(2000),
  FOREIGN KEY (questionID) REFERENCES QuestionCode(id)
);

CREATE TABLE IF NOT EXISTS UserProfile_RoadMap(
  id INT PRIMARY KEY AUTO_INCREMENT,
  userID INT,
  roadmapID INT,
  FOREIGN KEY (userID) REFERENCES UserProfile(id),
  FOREIGN KEY (roadmapID) REFERENCES RoadMap(id)
);

CREATE TABLE IF NOT EXISTS UserProfile_Preferences(
  id INT PRIMARY KEY AUTO_INCREMENT,
  userID INT UNIQUE,
  fontName VARCHAR(1000) DEFAULT 'default',
  themeName VARCHAR(1000) DEFAULT 'default',
  FOREIGN KEY (userID) REFERENCES UserProfile(id)
);