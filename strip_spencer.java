import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;

public class strip_spencer {
    public static boolean can(boolean[] on, int len) {
        long mod = 1000000033;
        long mod2 = 1000000021;
        long prime = 3;
        long[] pow = new long[on.length + 2];
        pow[0] = 1;
        long[] pow2 = new long[on.length + 2];
        pow2[0] = 1;
        for (int i = 1; i < pow.length; i++) {
            pow[i] = pow[i - 1] * prime;
            pow[i] %= mod;
            pow2[i] = pow2[i - 1] * prime;
            pow2[i] %= mod2;
        }
        HashSet<Long> set = new HashSet<Long>();
        long[] forward = new long[on.length];
        long[] backward = new long[on.length];
        long[] forward2 = new long[on.length];
        long[] backward2 = new long[on.length];
        long prev = 1;
        long prev2 = 1;
        long pr = 1;
        long pr2 = 1;
        for (int i = 0; i < on.length; i++) {
            forward[i] = prev + (on[i] ? 1 : 0) * pr;
            forward[i] %= mod;
            prev = forward[i];
            pr *= prime;
            pr %= mod;
            forward2[i] = prev2 + (on[i] ? 1 : 0) * pr2;
            forward2[i] %= mod2;
            prev2 = forward2[i];
            pr2 *= prime;
            pr2 %= mod2;
        }
        prev = 1;
        pr = 1;
        prev2 = 1;
        pr2 = 1;
        for (int i = on.length - 1; i >= 0; i--) {
            backward[i] = prev + (!on[i] ? 1 : 0) * pr;
            backward[i] %= mod;
            prev = backward[i];
            pr *= prime;
            pr %= mod;
            backward2[i] = prev2 + (!on[i] ? 1 : 0) * pr2;
            backward2[i] %= mod2;
            prev2 = backward2[i];
            pr2 *= prime;
            pr2 %= mod2;
        }
        int targetPow = on.length;
        for (int i = 0; i < on.length; i++) {
            if (i + len <= on.length) {
                long ret = forward[i + len - 1];
                if (i > 0) {
                    ret -= forward[i - 1];
                }
                ret += mod;
                ret %= mod;
                ret *= pow[targetPow - i];
                ret %= mod;

                long ret2 = forward2[i + len - 1];
                if (i > 0) {
                    ret2 -= forward2[i - 1];
                }
                ret2 += mod2;
                ret2 %= mod2;
                ret2 *= pow2[targetPow - i];
                ret2 %= mod2;
                if (set.contains(ret * mod + ret2)) {
                    return true;
                }
            }
            if (i - (len - 1) >= 0) {
                long ret = backward[i - (len - 1)];
                if (i + 1 < on.length) {
                    ret -= backward[i + 1];
                }
                ret += mod;
                ret %= mod;
                ret *= pow[targetPow - (on.length - 1 - i)];
                ret %= mod;
                long ret2 = backward2[i - (len - 1)];
                if (i + 1 < on.length) {
                    ret2 -= backward2[i + 1];
                }
                ret2 += mod2;
                ret2 %= mod2;
                ret2 *= pow2[targetPow - (on.length - 1 - i)];
                ret2 %= mod2;
                set.add(ret * mod + ret2);
            }
        }
        return false;
    }

    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        String str = in.readLine();
        boolean[] on = new boolean[str.length()];
        for (int i = 0; i < str.length(); i++) {
            on[i] = str.charAt(i) == '+';
        }
        int low = 0;
        int high = str.length() / 2;
        while (low < high) {
            int mid = (low + high + 1) / 2;
            if (can(on, mid)) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }
        System.out.println(low);
    }
}