CREATE TABLE IF NOT EXISTS UserProfile(
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE,
  useremail VARCHAR(255),
  password VARCHAR(255),
  userPicSource TEXT,
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
  itemStr VARCHAR(255),
  FOREIGN KEY (userID) REFERENCES UserProfile(id)
);

CREATE TABLE IF NOT EXISTS UserProfile_Friends (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userID INT,
  friendName VARCHAR(255),
  FOREIGN KEY (userID) REFERENCES UserProfile(id),
  FOREIGN KEY (friendName) REFERENCES UserProfile(username)
);

CREATE TABLE IF NOT EXISTS QuestionCode (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  article TEXT,
  answer TEXT,
  totalRating INT,
  numRating INT,
  author VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS QuestionCode_Tag (
  id INT PRIMARY KEY AUTO_INCREMENT,
  questionID INT,
  tag VARCHAR(255),
  FOREIGN KEY (questionID) REFERENCES QuestionCode(id)
);

CREATE TABLE IF NOT EXISTS QuestionSubmission (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sourceCode TEXT,
  sourceLanguage VARCHAR(255),
  userID INT,
  questionID INT,
  result VARCHAR(255),
  FOREIGN KEY (userID) REFERENCES UserProfile(id),
  FOREIGN KEY (questionID) REFERENCES QuestionCode(id)
);

CREATE TABLE IF NOT EXISTS RoadMap (
  id INT PRIMARY KEY AUTO_INCREMENT,
  description TEXT,
  graphData VARCHAR(255),
  title VARCHAR(255),
  userID INT,
  upvoteNum INT,
  downvoteNum INT,
  totalRating INT,
  numRating INT,
  FOREIGN KEY (userID) REFERENCES UserProfile(id)
);

CREATE TABLE IF NOT EXISTS Comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  imageSource TEXT,
  username VARCHAR(255),
  comment TEXT,
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
  testcase TEXT,
  FOREIGN KEY (questionID) REFERENCES QuestionCode(id)
);

CREATE TABLE IF NOT EXISTS UserProfile_RoadMap(
  id INT PRIMARY KEY AUTO_INCREMENT,
  userID INT,
  roadmapID INT,
  FOREIGN KEY (userID) REFERENCES UserProfile(id),
  FOREIGN KEY (roadmapID) REFERENCES RoadMap(id)
);