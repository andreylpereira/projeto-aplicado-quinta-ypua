package com.senai.api.utils;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class CryptoUtil {

	public static SecretKey getFixedSecretKey() {
		byte[] keyBytes = new byte[] { (byte) 0x01, (byte) 0x23, (byte) 0x45, (byte) 0x67, (byte) 0x89, (byte) 0xAB,
				(byte) 0xCD, (byte) 0xEF, (byte) 0x12, (byte) 0x34, (byte) 0x56, (byte) 0x78, (byte) 0x9A, (byte) 0xBC,
				(byte) 0xDE, (byte) 0xF0 };
		return new SecretKeySpec(keyBytes, "AES");
	}

	public static String encryptCPF(String cpf, SecretKey key) throws Exception {
		Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, key);

		byte[] encryptedBytes = cipher.doFinal(cpf.getBytes());
		return Base64.getEncoder().encodeToString(encryptedBytes);
	}

	public static String decryptCPF(String encryptedData, SecretKey key) throws Exception {
		Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, key);

		byte[] decodedData = Base64.getDecoder().decode(encryptedData);
		byte[] decryptedBytes = cipher.doFinal(decodedData);
		return new String(decryptedBytes);
	}
}
