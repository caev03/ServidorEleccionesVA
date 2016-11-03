package creadorDeScriptsVA;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.swing.JOptionPane;

public class EleccionesScripter {

	public final static String YEAR = "year";
	public final static String ELEC_TYPE = "elec_type";
	public final static String DPTO_CODE = "dpto_code";
	public final static String MUNI_CODE = "muni_code";
	public final static String PARTY_CODE = "party_code";
	public final static String CODE_LIST = "code_list";
	public final static String FIRST_LASTNAME = "first_lastname";
	public final static String SECOND_LASTNAME = "second_lastname";
	public final static String NAME = "name";
	public final static String VOTES = "votes";
	public final static String SEATS = "seats";

	public static void main(String[] args) {
		try{
			//			public final static Y = "";
			String BASE_URI = "E:/VA/BES/Datasets/Source/SoloCSV";
			File directory = new File(BASE_URI);
			if(directory.isDirectory()){
				String[] files = directory.list();
				boolean continuar = true;
				for (int i = 0; i < files.length-1 && continuar; i++) {
					System.out.println(i);
					String string = files[i];
					BufferedReader br = new BufferedReader(new FileReader(BASE_URI+"/"+string));
					String line = br.readLine();
					String[] headers = line.split(",");
					Map<String, Integer> map = new HashMap<String, Integer>();
					for (int j = 0; j < headers.length; j++) {
						map.put(headers[j], j);
					}
					PrintWriter pw = new PrintWriter(BASE_URI+"/SQL/"+string.replace(".dta.csv", "")+".sql", "UTF-8");
					pw.println("INSERT INTO EleccionesDB.Votaciones ("+YEAR+","+ELEC_TYPE+","+DPTO_CODE+","+MUNI_CODE+","+PARTY_CODE+","+CODE_LIST+","+FIRST_LASTNAME+","+SECOND_LASTNAME+","+NAME+","+VOTES+","+SEATS+") VALUES");
					line = br.readLine();
					String nextLine = br.readLine();
					while(line !=null){
						if(line.endsWith(",")){
							line +="0";
						}
						if(line.startsWith(",")){
							line = "1800"+line;
						}
						String[] data = line.split(",");
						String query = "(";
						query += ((data[map.get(YEAR)].equals(""))?"NULL":data[map.get(YEAR)])+",";
						query += ((data[map.get(ELEC_TYPE)].equals(""))?"NULL":data[map.get(ELEC_TYPE)])+",";
						query += ((data[map.get(DPTO_CODE)].equals(""))?"NULL":data[map.get(DPTO_CODE)])+",";
						query += ((data[map.get(MUNI_CODE)].equals(""))?"NULL":data[map.get(MUNI_CODE)])+",";
						query += ((data[map.get(PARTY_CODE)].equals(""))?"NULL":data[map.get(PARTY_CODE)])+",";
						query += ((data[map.get(CODE_LIST)].equals(""))?"NULL":data[map.get(CODE_LIST)])+",";
						query += ((data[map.get(FIRST_LASTNAME)].equals(""))?"NULL":"\""+data[map.get(FIRST_LASTNAME)].trim()+"\"")+",";
						query += ((data[map.get(SECOND_LASTNAME)].equals(""))?"NULL":"\""+data[map.get(SECOND_LASTNAME)].trim()+"\"")+",";
						query += ((data[map.get(NAME)].equals(""))?"NULL":"\""+data[map.get(NAME)].trim()+"\"")+",";
						query += ((data[map.get(VOTES)].equals(""))?"NULL":data[map.get(VOTES)])+",";
						query += ((data[map.get(SEATS)].equals(""))?"NULL":data[map.get(SEATS)])+")";
						if(nextLine == null){
							query += ";";
							line = null;
							nextLine= null;
						}
						else{
							query += ",";
							line = nextLine;
							nextLine = br.readLine();
						}
						pw.println(query);
					}
					pw.close();
					br.close();
				}
				
				
				
				
				//					if(!(line.contains("year") &&
				//							line.contains("elec_type") &&
				//							line.contains("dpto_code") &&
				//							line.contains("muni_code") &&
				//							line.contains("party_code") &&
				//							line.contains("code_list") &&
				//							line.contains("first_lastname") &&
				//							line.contains("second_lastname") &&
				//							line.contains("name") &&
				//							line.contains("votes") &&
				//							line.contains("seats"))){
				//						System.out.println(string + " - "+line);						
				//					}
				//				for (int i = 0; i < files.length && continuar; i++) {
				//					String string = files[i];
				//					BufferedReader br = new BufferedReader(new FileReader(string));
				//					String line = br.readLine();
				//					String[] encabezados = line.split(",");
				//					String resp = JOptionPane.showInputDialog(line);
				//					String[] 
				//				}
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
}
