import subprocess,os

               
def runcode(filename,tempfilename,language):
    print (filename,tempfilename,language)
    if(language=="javac"):
        p=subprocess.Popen(["javac",filename], stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        out, err = p.communicate()
        if (err!=""):
            #print (out,err)
            return "here is the stdout(if any)\n"+out.decode('utf-8')+"here is error(if any)\n"+err.decode('utf-8')
        p=subprocess.Popen(["java",tempfilename], stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        out, err = p.communicate()
    else:
        p=subprocess.Popen([language,filename], stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        out, err = p.communicate()
        #print (out,err)
    return "here is the stdout(if any)\n"+out.decode('utf-8')+"here is error(if any)\n"+err.decode('utf-8')
#a=runcode("temphello3.java","temphello3","javac")
#print (a)
