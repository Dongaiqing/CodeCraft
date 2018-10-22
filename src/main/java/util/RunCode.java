package util;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import javax.swing.JFrame;

public class RunCode {
	private Path userFolderPath; 
	private String sourceFilePath;
	private ProcessBuilder builder; // Use for compiling and running
	private SourceCode sourceCode ;

	public RunCode(SourceCode sourceCode) {
		this.sourceCode = sourceCode;
		userFolderPath = Paths.get(System.getProperty("user.dir") + "/src/main/resources/user/" + getUserId());
		sourceFilePath = userFolderPath.toString() + "/" + sourceCode.getTitle() + "." + sourceCode.getFileExt();
        builder = new ProcessBuilder();

        // Create working directory
        createWorkingDirectory(userFolderPath);

        // Set working directory
        builder.directory(userFolderPath.toFile());
	}
	
	private void createWorkingDirectory(Path path) {
	     if (!Files.exists(path)) {
             
         	try {
                 Files.createDirectories(path);
             } catch (IOException e) {
                 //fail to create directory
                 e.printStackTrace();
             }
         
         }
	}

	//TODO should also get a UserID+ UUID
	private String getUserId() {
		return UUID.randomUUID().toString();
	}
	
	private void generateSourceFile(String sourceFilePath) throws IOException {
	      FileWriter fileWriter = new FileWriter(sourceFilePath);
          fileWriter.write(sourceCode.getCode());
          fileWriter.close();
	}
	private void generatelog() throws IOException  {
		String s=null;
		Process p = builder.start();
		
	       
        CodeResult codeResult = new CodeResult();
        System.out.println(userFolderPath);
        PrintWriter printWriter = new PrintWriter(userFolderPath+"/"+"log.txt");

        BufferedReader stdInput = new BufferedReader(new
                InputStreamReader(p.getInputStream()));

        BufferedReader stdError = new BufferedReader(new 
             InputStreamReader(p.getErrorStream()));

        // read the output from the command
        System.out.println("Here is the standard output of the command:\n");
        printWriter.println("printWrite: Here is the standard output of the command:\n");
        StringBuilder output = new StringBuilder();
        while ((s = stdInput.readLine()) != null) {
            printWriter.println(s);
            output.append(s);
            output.append(System.getProperty("line.separator"));
        }
        codeResult.setStdout(output.toString());
        System.out.println(codeResult.getStdout());

        // read any errors from the attempted command
        System.out.println("Here is the standard error of the command (if any):\n");
        printWriter.println("printWrite: Here is the standard error of the command (if any):\n");
        StringBuilder error = new StringBuilder();
        while ((s = stdError.readLine()) != null) {
            printWriter.println(s);
            error.append(s);
            error.append(System.getProperty("line.separator"));
        }
        codeResult.setException(error.toString());
        System.out.println(codeResult.getException());

        printWriter.close();
		
	}
	
	public Path executeCode()  {
		
        try {
            System.out.println("Java Home: " + System.getProperty("java.home") + "bin/java");
            System.out.println("User Home: " + System.getProperty("user.home"));
            System.out.println("User Directory: " + System.getProperty("user.dir"));

            // Generate java file in the hardisk
            generateSourceFile(sourceFilePath);

            //TODO check file exists?
            File sourceFile = new File(sourceFilePath);
            if(!sourceFile.exists() || sourceFile.isDirectory()) {
                System.out.println("source file creation failed");
            }

            if(sourceCode.getFileExt().equals("java")) {
                String compileCommand = "javac " + sourceCode.getTitle() + "." + sourceCode.getFileExt();
                String runCommand = "java " + sourceCode.getTitle();
                builder.command("/bin/sh", "-c", compileCommand + ";" + runCommand);
            } else {
                builder.command("/bin/sh", "-c", "python " + sourceFilePath.toString());
            }
            generatelog();
            /*
            Process p = builder.start();
       
            CodeResult codeResult = new CodeResult();

            PrintWriter printWriter = new PrintWriter("log.txt");

            BufferedReader stdInput = new BufferedReader(new
                    InputStreamReader(p.getInputStream()));

            BufferedReader stdError = new BufferedReader(new 
                 InputStreamReader(p.getErrorStream()));

            // read the output from the command
            System.out.println("Here is the standard output of the command:\n");
            printWriter.println("printWrite: Here is the standard output of the command:\n");
            StringBuilder output = new StringBuilder();
            while ((s = stdInput.readLine()) != null) {
                printWriter.println(s);
                output.append(s);
                output.append(System.getProperty("line.separator"));
            }
            codeResult.setStdout(output.toString());
            System.out.println(codeResult.getStdout());

            // read any errors from the attempted command
            System.out.println("Here is the standard error of the command (if any):\n");
            printWriter.println("printWrite: Here is the standard error of the command (if any):\n");
            StringBuilder error = new StringBuilder();
            while ((s = stdError.readLine()) != null) {
                printWriter.println(s);
                error.append(s);
                error.append(System.getProperty("line.separator"));
            }
            codeResult.setException(error.toString());
            System.out.println(codeResult.getException());

            printWriter.close();
           
            //System.exit(0);
             
             */
        }
        catch (IOException e) {
            System.out.println("IOException happened - here's what I know: ");
            e.printStackTrace();
           // System.exit(-1);
        }
        catch (Exception e) {
            System.out.println("Exception happened - here's what I know: ");
            e.printStackTrace();
           // System.exit(-1);
        }
        return userFolderPath;
	}

    public static String readFileAsString(String fileName) throws Exception {
        String data = "";
        data = new String(Files.readAllBytes(Paths.get(fileName)));
        return data;
    }
}