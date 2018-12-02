import subprocess


class exeucteCode:

    @staticmethod
    def runcode(filename, tempfilename, language):

        PATH_JAVAC = "/usr/bin/javac "
        PATH_JAVA = "/usr/bin/java "
        PATH_PYTHON = "/usr/local/bin/python3 "
        PATH_NODE = "/home/ec2-user/.nvm/versions/node/v11.2.0/bin/node "
        print(filename, tempfilename, language)

        if language == "javac":
            p = subprocess.Popen(
                PATH_JAVAC + filename, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True,
                executable="/bin/bash")
            out, err = p.communicate()
            if (err != ""):
                return "here is the stdout(if any)\n" + out.decode('utf-8') + "here is error(if any)\n" + err.decode(
                    'utf-8')
            p = subprocess.Popen(
                PATH_JAVA + tempfilename, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True,
                executable="/bin/bash")
            out, err = p.communicate()
        elif language == "python3":
            p = subprocess.Popen(
                PATH_PYTHON + filename, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True,
                executable="/bin/bash")
            out, err = p.communicate()
        elif language == "node":
            p = subprocess.Popen(
                PATH_NODE + filename, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True,
                executable="/bin/bash")
            out, err = p.communicate()

        return "here is the stdout(if any)\n" + out.decode('utf-8') + "here is error(if any)\n" + err.decode('utf-8')
