function xor_encrypt(s,k)
	{
	
	var sencrypted ='';
	var slength =s.length;
	var klength=k.length;
	/* the encryption is done char by char */
	for (i=0;i<slength;i++) 
	{
		var code =s.charCodeAt(i);
		code=code^(k.charCodeAt(i%klength));
		var chaineHexa = code.toString(16);
		var x = parseInt(Math.floor((Math.random()*254)+1)/16)*16+chaineHexa.length; //the random is generated to make the output of the encryption more complex
		var random = x.toString(16);
		if(random.length==1)
			random = '0'+random; //a padding to make all randoms encoded in two bytes
			
		chaineHexa= random+chaineHexa;
		sencrypted+=chaineHexa; //append each char encryption with the previous one
	}
	return sencrypted;
	}

	module.exports = xor_encrypt;