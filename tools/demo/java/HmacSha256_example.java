package tools;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Formatter;

public class HmacSha256_example {

    /**
     * HmacSha256
     * 提供相較一般 SHA 更好的防護能力，因為其具有自身的亂數因子，避免彩虹表猜值攻擊
     */
    public String stringToHmacSha256(String content, String pKey) {
        String res = null;
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(pKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(content.getBytes(StandardCharsets.UTF_8));
            res = Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch ( Exception e ) {
            e.printStackTrace();
        }
        return res;
    }

}
