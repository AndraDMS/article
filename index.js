
var txt = '/body{}{ /block{ "width":"50" }{ /txt{ "deplete":"word" }{ In cryptography, the one-time pad (OTP) is an encryption technique that cannot be cracked, but requires the use of a one-time pre-shared key the same size as, or longer than, the message being sent. In this technique, a plaintext is paired with a random secret key (also referred to as a one-time pad). Then, each bit or character of the plaintext is encrypted by combining it with the corresponding bit or character from the pad using modular addition. If the key is truly random, is at least as long as the plaintext, is never reused in whole or in part, and is kept completely secret, then the resulting ciphertext will be impossible to decrypt or break. It has also been proven that any cipher with the perfect secrecy property must use keys with effectively the same requirements as OTP keys. However, practical problems have prevented one-time pads from being widely used. } /txt{ "deplete":"letter" }{ /span{ "fontStyle":"italic" }{ First described by Frank Miller in 1882, the one-time pad was re-invented in 1917. On July 22, 1919, U.S. Patent 1,310,719 was issued to Gilbert S. Vernam for the XOR operation used for the encryption of a one-time pad. Derived from his Vernam cipher, the system was a cipher that combined a message with a key read from a punched tape. In its original form, Vernam\'s system was vulnerable because the key tape was a loop, which was reused whenever the loop made a full cycle. One-time use came later, when Joseph Mauborgne recognized that if the key tape were totally random, then cryptanalysis would be impossible. First described by Frank Miller in 1882, the one-time pad was re-invented in 1917. On July 22, 1919, U.S. Patent 1,310,719 was issued to Gilbert S. Vernam for the XOR operation used for the encryption of a one-time pad. Derived from his Vernam cipher, the system was a cipher that combined a message with a key read from a punched tape. In its original form, Vernam\'s system was vulnerable because the key tape was a loop, which was reused whenever the loop made a full cycle. One-time use came later, when Joseph Mauborgne recognized that if the key tape were totally random, then cryptanalysis would be impossible. First described by Frank Miller in 1882, the one-time pad was re-invented in 1917. On July 22, 1919, U.S. Patent 1,310,719 was issued to Gilbert S. Vernam for the XOR operation used for the encryption of a one-time pad. Derived from his Vernam cipher, the system was a cipher that combined a message with a key read from a punched tape. In its original form, Vernam\'s system was vulnerable because the key tape was a loop, which was reused whenever the loop made a full cycle. One-time use came later, when Joseph Mauborgne recognized that if the key tape were totally random, then cryptanalysis would be impossible. First described by Frank Miller in 1882, the one-time pad was re-invented in 1917. On July 22, 1919, U.S. Patent 1,310,719 was issued to Gilbert S. Vernam for the XOR operation used for the encryption of a one-time pad. Derived from his Vernam cipher, the system was a cipher that combined a message with a key read from a punched tape. In its original form, Vernam\'s system was vulnerable because the key tape was a loop, which was reused whenever the loop made a full cycle. One-time use came later, when Joseph Mauborgne recognized that if the key tape were totally random, then cryptanalysis would be impossible. First described by Frank Miller in 1882, the one-time pad was re-invented in 1917. On July 22, 1919, U.S. Patent 1,310,719 was issued to Gilbert S. Vernam for the XOR operation used for the encryption of a one-time pad. Derived from his Vernam cipher, the system was a cipher that combined a message with a key read from a punched tape. In its original form, Vernam\'s system was vulnerable because the key tape was a loop, which was reused whenever the loop made a full cycle. One-time use came later, when Joseph Mauborgne recognized that if the key tape were totally random, then cryptanalysis would be impossible. First described by Frank Miller in 1882, the one-time pad was re-invented in 1917. On July 22, 1919, U.S. Patent 1,310,719 was issued to Gilbert S. Vernam for the XOR operation used for the encryption of a one-time pad. Derived from his Vernam cipher, the system was a cipher that combined a message with a key read from a punched tape. In its original form, Vernam\'s system was vulnerable because the key tape was a loop, which was reused whenever the loop made a full cycle. One-time use came later, when Joseph Mauborgne recognized that if the key tape were totally random, then cryptanalysis would be impossible. First described by Frank Miller in 1882, the one-time pad was re-invented in 1917. } 2 } } }'
var page = {};

function printPages(t) {
	page = new elem(t,0,t.length);
	page.setType();
	page.setTypeId();
	page.setArgNo();
	page.setArgs();
	page.applyArgs();

	reprintPages(page)

}

function reprintPages(page_) {
	for (var j = 0; j < page_.children.length; j++) {
		var pages = page_.children[j].allSplits();
		document.getElementById("wrap").innerHTML = "";
		for (var i = 0; i < pages.length; i++) {
			document.getElementById("wrap").appendChild(pages[i].form());
		}
	}
}

printPages(txt)

window.addEventListener("resize", function() {reprintPages(page)});