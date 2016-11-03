package creadorDeScriptsVA;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;

public class PartyCodesScripting {
	 public static void main(String[] args) {
		try {
			String BASE_URI = "E:/VA/Faltan/Pesados";
			String NEW_URI = "E:/VA/Faltan";
			File directory = new File(BASE_URI);
			String[] list = directory.list();
			for (int j = 0; j < list.length; j++) {
				System.out.println(list[j]);
				String asd = list[j].replace(".",";");
				System.out.println(asd);
				String[] d = asd.split(";");
				String s = BASE_URI + "/"+list[j];
				BufferedReader br = new BufferedReader(new FileReader(s));
				String encabezado = br.readLine();
				String linea = br.readLine();
				int index = 0;
				int i = 0;
				System.out.println(d.length);
				PrintWriter pw = new PrintWriter(NEW_URI+"/"+d[0]+"("+index+").sql");
				pw.println(encabezado);
				String nextLinea = br.readLine();
				boolean termino = false;
				while(linea != null && !termino){
					if(!nextLinea.contains(";")){
						if(i<36999){
							pw.println(linea);
							linea = nextLinea;
							nextLinea = br.readLine();
							i++;
						}
						else{
							linea = linea.replace("),", ");");
							pw.println(linea);
							pw.close();
							i=0;
							System.out.println(index);
							index++;
							pw = new PrintWriter(NEW_URI+"/"+d[0]+"("+index+").sql");
							pw.println(encabezado);
							linea = nextLinea;
							nextLinea = br.readLine();	
						}
						
					}
					else{
						pw.println(linea);
						pw.println(nextLinea);
						pw.close();
						termino = true;
					}
				}
				br.close();
			}
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}
}
