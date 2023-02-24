package app.encrypt;

import framework.hash.HashServiceStatic;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.Security;
import java.util.Base64;

/**
 * modify: 2023-01-10
 * AES-GCM
 * https://github.com/bcgit/bc-java/blob/master/prov/src/test/java/org/bouncycastle/jce/provider/test/AESTest.java
 * -
 * 通常於 CTR, GCM 模式中會要求 IV 是持續變動的，
 * 此方式弱化 IV 但帶來方便性，可以公開 IV 值傳遞，作為非對稱加密的方式使用，
 * 不需要取得 key 值是因為真正的私鑰就是你輸入的 private_key 那組文字，
 * 而創建 AES-GCM 的過程金鑰是由其 SHA-256 衍生出 key, iv
 */
public class AesGcm {

    public AesGcm() {
        Security.addProvider(new BouncyCastleProvider()); // provider
    }

    public String encrypt_string(String plain_text, String private_key) throws Exception {
        KeyPair keyPair = build_key_pair(private_key);
        return encrypt(plain_text, keyPair.key, keyPair.iv);
    }

    public String decrypt_string(String b64_enc_str, String private_key) throws Exception {
        KeyPair keyPair = build_key_pair(private_key);
        return decrypt(b64_enc_str, keyPair.key, keyPair.iv);
    }

    public String get_iv(String private_key) {
        KeyPair keyPair = build_key_pair(private_key);
        return keyPair.iv;
    }

    private static String encrypt(String plain_text, String privateKey, String iv) throws Exception {
        byte[] data_byte = plain_text.getBytes(StandardCharsets.UTF_8);
        byte[] key_byte = privateKey.getBytes(StandardCharsets.UTF_8);
        byte[] iv_byte = iv.getBytes(StandardCharsets.UTF_8);
        Key aes_key = new SecretKeySpec(key_byte, "AES");
        // encrypt
        Cipher in = Cipher.getInstance("AES/GCM/NoPadding", "BC");
        in.init(Cipher.ENCRYPT_MODE, aes_key, new IvParameterSpec(iv_byte));
        byte[] enc_byte = in.doFinal(data_byte);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(enc_byte);
    }

    private static String decrypt(String b64_enc_text, String privateKey, String iv) throws Exception {
        // byte[] data_byte = data.getBytes(StandardCharsets.UTF_8);
        byte[] key_byte = privateKey.getBytes(StandardCharsets.UTF_8);
        byte[] iv_byte = iv.getBytes(StandardCharsets.UTF_8);
        Key aes_key = new SecretKeySpec(key_byte, "AES");
        // decrypt
        Cipher out = Cipher.getInstance("AES/GCM/NoPadding", "BC");
        out.init(Cipher.DECRYPT_MODE, aes_key, new IvParameterSpec(iv_byte));
        byte[] data_byte = Base64.getUrlDecoder().decode(b64_enc_text);
        byte[] dec_byte = out.doFinal(data_byte);
        return new String(dec_byte, StandardCharsets.UTF_8);
    }

    // 以自定義的方式建立金鑰組
    private KeyPair build_key_pair(String plain_text) {
        String key_hash_256 = stringToSHA256(plain_text);
        KeyPair keyPair = new KeyPair();
        keyPair.key = key_hash_256.substring(0, 32);
        keyPair.iv = stringToSHA256(key_hash_256); // double hash
        return keyPair;
    }

    class KeyPair {
        String key = null;
        String iv = null;
    }

    private String stringToSHA256(String content) {
        return stringToHash("SHA-256", content);
    }

    /**
     * https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/security/MessageDigest.html
     * https://docs.oracle.com/en/java/javase/11/docs/specs/security/standard-names.html#messagedigest-algorithms
     */
    private String stringToHash(String hashType, String content) {
        String result = null;
        try {
            MessageDigest messageDigest = MessageDigest.getInstance(hashType);
            messageDigest.reset();
            messageDigest.update(content.getBytes(StandardCharsets.UTF_8));
            result = byteToHex(messageDigest.digest());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * 雜湊碼 byte[] 轉換為 string 的通用方法
     */
    private String byteToHex(byte[] hash) {
        Formatter formatter = new Formatter();
        for ( byte b : hash ) { formatter.format("%02x", b); }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

}
