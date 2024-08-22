## Discord RT Ticket Bot (Discord.js v14)

Bu bot, Discord sunucunuz için **düğmeye tıklama** ile kolayca ticket oluşturma imkanı sunan ve **`/setup-ticket`** slash komutu ile hızlıca kurabileceğiniz bir ticket sistemidir.

### Özellikler

* **Düğme ile Ticket Oluşturma:** Kullanıcılar, botun gönderdiği bir mesaja eklenen bir düğmeye tıklayarak yeni bir ticket oluşturabilir.
* **Kolay Kurulum:** `/setup-ticket` slash komutu ile ticket panelini hızlı ve kolay bir şekilde kurabilirsiniz.
* **Ticket Yönetimi:** Yetkililer, ticket'ları kapatabilir, yeniden adlandırabilir ve silebilir.
* **Özelleştirilebilir:** Botun mesajlarını ve embedlerini kendi ihtiyaçlarınıza göre düzenleyebilirsiniz.
* **Ve dahası!**
### Kurulum

1. Bu depoyu indirin veya kopyalayın.
2. `config.js` dosyasındaki ayarları Discord botunuzun token'ı, prefix'i ve istediğiniz diğer ayarlarla güncelleyin.
3. Bir terminal açın ve proje dizinine gidin.
4. `npm install` komutunu kullanarak gerekli bağımlılıkları yükleyin.
5. `node index.js` komutunu kullanarak botu başlatın.
6. Discord sunucunuza gidin ve `/setup-ticket` komutunu kullanarak ticket panelini kurun.

### Kullanım

1. `/setup-ticket` komutunu kullanarak ticket panelini istediğiniz kanala kurun.
2. Bot, panelde kullanıcının ticket oluşturmak için tıklayabileceği bir düğme bulunan bir mesaj gönderecektir.
3. Bir kullanıcı düğmeye tıkladığında, bot yeni bir ticket kanalı oluşturacak ve kullanıcıyı o kanala ekleyecektir.

### Komutlar

* `/setup-ticket`: Ticket panelini kurar.
* `/change-ticket-settings`: Ticketa panelinin ayarlarını değiştirmenize yarar.
* `/send-ticket-panel`: Kurduğunuz ticket paneli kanala göndermenize yarar.
* `/add-user-to-ticket`: Ticketa kullanıcı eklemenize yarar.
* `/remove-user-to-ticket`: Ticketa eklenen kullanıcıyı çıkarmanıza yarar.

### Katkıda Bulunma

Bu projeye katkıda bulunmak isterseniz, lütfen bir pull request gönderin.

### Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.
