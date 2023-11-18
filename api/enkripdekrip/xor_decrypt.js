function xor_decrypt(s,k)
	{
		var decrypted = '';
		var klength = k.length;
		var h = "";
		var len = s.length;
		var a = 0;
		var j = 0;
		var o = 0;
		
		while(o<len) 
		{	
			var slen ="";
			slen = s[o]+s[o+1]; //read the length of the encoded char
			var nlen = parseInt(slen,16)%16;
			h=s.substr(o+2,nlen); //getting the decrypted char

			a=parseInt(h,16); // parse the decrypted char 
			a=a^(k.charCodeAt(j%klength)); // decryption
		
			decrypted+=String.fromCharCode(a); // append the original char with the previous one
			
			o=o+nlen+2; 
			j++;
		}	
		return decrypted;
	}

	module.exports = xor_decrypt;