using UnityEngine;
using System.Collections;
using UnityEngine.Networking;
using SimpleJSON;


public class API : MonoBehaviour {
	

	void Start() {
		StartCoroutine(GetText());
	}

	IEnumerator GetText() {
		UnityWebRequest www = UnityWebRequest.Get("https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.exhibitions.getInfo&access_token=c5ff88b045ab999eda0cc310e720b295&exhibition_id=51668993&format=json");
		yield return www.Send();



		if(www.isNetworkError) {
			Debug.Log(www.error);
		}
		else {
			// Show results as text
			Debug.Log(www.downloadHandler.text);

			// Or retrieve results as binary data
			byte[] results = www.downloadHandler.data;

			string result = JSON.Parse(www.downloadHandler.text);






		
		}
	}
}
	