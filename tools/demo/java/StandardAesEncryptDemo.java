package tools;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.AlgorithmParameters;
import java.security.Key;
import java.security.MessageDigest;
import java.security.Security;
import java.util.Base64;
import java.util.Formatter;

/**
 * https://mvnrepository.com/artifact/org.bouncycastle/bcprov-jdk15on
 * https://cdnjs.com/libraries/crypto-js
 *
 * http://www.appblog.cn/2019/06/29/%E5%89%8D%E7%AB%AF%20crypto-js%20AES%20%E5%8A%A0%E8%A7%A3%E5%AF%86/
 * https://moln.site/2018/06/22/crypto-js-aes-usage.html
 * https://my.oschina.net/leaforbook/blog/1808360
 * http://ijecorp.blogspot.com/2013/08/python-m2crypto-aes-encrypt-decrypt.html
 * https://stackoverflow.com/questions/36909746/aes-ctr-encrypt-in-go-and-decrypt-in-cryptojs
 * https://crypto.stackexchange.com/questions/19280/is-there-any-area-where-aes-cbc-cannot-be-used-if-so-why
 * 由以上參考資料擷取多處程式碼與原理撰寫
 *
 * 191023
 * 技術選型 AES-256-CTR 標準實作範例
 * 明碼 key 將由 SHA-256 拆分前後段作為 key 與 iv 值
 * （一）AES 是 Rijndael 加密的簡化版本，所以較完整的密鑰位元數只能使用在 Rijndael 之上（關係釐清）
 * （二）選擇 Cipher 為 CTR，因為支援各區塊獨立加解密更相容於多核心的執行環境（CBC 僅解密區塊可獨立執行）
 * （三）要注意 AES 加密都是針對 byte 運作，所以實際操作時都是由 byte[] 去作為值
 */
public class StandardAesEncryptDemo {

    public StandardAesEncryptDemo() {
        Security.addProvider(new BouncyCastleProvider()); // for AES use
    }

    public String encryptString(String content, String privateKey) {
        Security.addProvider(new BouncyCastleProvider());
        String tmpStr = stringToSHA256(privateKey);
        String key = tmpStr.substring(0, 32);
        String iv = tmpStr.substring(32, 48);
        String res = null;
        try {
            res = encrypt(content, key, iv);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    public String decryptString(String base64str, String privateKey) {
        Security.addProvider(new BouncyCastleProvider());
        String tmpStr = stringToSHA256(privateKey);
        String key = tmpStr.substring(0, 32);
        String iv = tmpStr.substring(32, 48);
        String res = null;
        try {
            res = decrypt(base64str, key, iv);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    private static String encrypt(String data, String privateKey, String iv) throws Exception {

        byte[] dataByte = data.getBytes(StandardCharsets.UTF_8);
        byte[] keyByte = privateKey.getBytes(StandardCharsets.UTF_8);
        byte[] ivByte = iv.getBytes(StandardCharsets.UTF_8);

        String encryptBase64str;

        // Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding","BC");
        Cipher cipher = Cipher.getInstance("AES/CTR/PKCS7Padding","BC");
        Key sKeySpec = new SecretKeySpec(keyByte, "AES");
        AlgorithmParameters params = AlgorithmParameters.getInstance("AES");
        params.init(new IvParameterSpec(ivByte));
        cipher.init(Cipher.ENCRYPT_MODE, sKeySpec, params);

        byte[] result = cipher.doFinal(dataByte);
        encryptBase64str = Base64.getUrlEncoder().withoutPadding().encodeToString(result);

        return encryptBase64str;
    }

    private static String decrypt(String encryptBase64str, String privateKey, String iv) throws Exception {

        byte[] dataByte = Base64.getUrlDecoder().decode(encryptBase64str); // base64str to byte
        byte[] keyByte = privateKey.getBytes(StandardCharsets.UTF_8);
        byte[] ivByte = iv.getBytes(StandardCharsets.UTF_8);

        String decryptStr;

        // Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding","BC");
        Cipher cipher = Cipher.getInstance("AES/CTR/PKCS7Padding","BC");
        Key sKeySpec = new SecretKeySpec(keyByte, "AES");
        AlgorithmParameters params = AlgorithmParameters.getInstance("AES");
        params.init(new IvParameterSpec(ivByte));
        cipher.init(Cipher.DECRYPT_MODE, sKeySpec, params);

        byte[] result = cipher.doFinal(dataByte);
        decryptStr = new String(result);

        return decryptStr;
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

    private String byteToHex(byte[] hash) {
        Formatter formatter = new Formatter();
        for ( byte b : hash ) { formatter.format("%02x", b); }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

}
