/*
[+] =============================================== [+]
[+]                                                            [+]
[+] - INSTALLER PTERODACTYL                              [+]
[+]                                                            [+]
[+]  TQTO :                                                   [+]
[+] • WannOffc ( MySelf)                                     [+]
[+] • Creator Bot WhatsApp & Telegram                     [+]
[+] • Para Pengguna Bot Tele & Wa                         [+]
[+]                                                            [+]
[+] © CreateByWannFyy                                      [+]
[+] =============================================== [+]
*/

// KALO REUPLOAD SC JAN LUPA TAG YT GW @wannoffc
// JANGAN APUS CREDIT, UDAH DI BAGI FREE JAN GA TAU DIRI

const TelegramBot = require('node-telegram-bot-api');
const { Client } = require('ssh2');

const settings = require('./config');
const botToken = settings.token;
const bot = new TelegramBot(botToken, { polling: true });
const sendMessage = (chatId, text) => bot.sendMessage(chatId, text);
function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
  const length = 10;
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Command Handler 'start'
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `┏━━ 𝗟𝗜𝗦𝗧 𝗠𝗘𝗡𝗨 ━⊜\n ∘ /installpanel\n ∘ /wingsstart\n © WannFyy\nscript by @wannoffc08
┗━━━━━━━━━━━━━━━━`);
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Command Handler 'installpanel'
bot.onText(/^(\.|\#|\/)installpanel$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /installpanel ipvps,password,domainpnl,domainnode,ramvps ( contoh : 8000 = ram 8\nscript by @wannoffc08`);
  });
bot.onText(/\/installpanel (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 3) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /installpanel ipvps,password,domainpnl,domainnode,ramvps ( contoh : 8000 = ram 8\nscript by @wannoffc08');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const subdomain = t[2];
  const domainnode = t[3];
  const ramvps = t[4];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
 let password = generateRandomPassword();
 const command = 'bash <(curl -s https://pterodactyl-installer.se)';
 const commandWings = 'bash <(curl -s https://pterodactyl-installer.se)';  
 const conn = new Client();

  conn.on('ready', () => {
    sendMessage(chatId, `PROSES PENGINSTALLAN SEDANG BERLANGSUNG MOHON TUNGGU 5-10MENIT\nscript by @wannoffc08`);
    conn.exec(command, (err, stream) => {
      if (err) throw err;

      stream.on('close', (code, signal) => {
        console.log(`Stream closed with code ${code} and signal ${signal}`);
        installWings(conn, domainnode, subdomain, password, ramvps);
      }).on('data', (data) => {
        handlePanelInstallationInput(data, stream, subdomain, password);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
      });
    });
  }).connect(connSettings);
  
  async function installWings(conn, domainnode, subdomain, password, ramvps) {
        sendMessage(chatId, `PROSES PENGINSTALLAN WINGS SEDANG BERLANGSUNG MOHON TUNGGU 5 MENIT\nscript by @wannoffc08`);
        conn.exec(commandWings, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Wings installation stream closed with code ${code} and signal ${signal}');
                createNode(conn, domainnode, ramvps, subdomain, password);
            }).on('data', (data) => {
                handleWingsInstallationInput(data, stream, domainnode, subdomain);
        }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }

    async function createNode(conn, domainnode, ramvps, subdomain, password) {
        const command = 'bash <(curl -s https://raw.githubusercontent.com/wndrzzka/installer-pterodactlty/main/install.sh)';
        sendMessage(chatId, `MEMULAI CREATE NODE & LOCATION\nscript by @wannoffc08`);     
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Node creation stream closed with code ${code} and ${signal} signal');
                conn.end();
                sendPanelData(subdomain, password);
            }).on('data', (data) => {
                handleNodeCreationInput(data, stream, domainnode, ramvps);
        }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }
        
   // Func Handler 'sendPanelData' 
    function sendPanelData(subdomain, password) {
        sendMessage(chatId,`DATA PANEL ANDA\n\nUSERNAME: admin\nPASSWORD: ${password}\nLOGIN: ${subdomain}\n\nNote: Semua Instalasi Telah Selesai Silahkan Create Allocation Di Node Yang Di buat Oleh Bot Dan Ambil Token Configuration dan ketik .startwings (token) \nNote: HARAP TUNGGU 1-5MENIT BIAR WEB BISA DI BUKA\nscript by @wannoffc08`);
    }
    
   // Func Handler 'handlePanelInstallationInput' 
   function handlePanelInstallationInput(data, stream, subdomain, password) {
        if (data.toString().includes('Input')) {
            stream.write('0\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1248\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('Asia/Jakarta\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('adm\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${password}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('yes\n');
        }
        if (data.toString().includes('Please read the Terms of Service')) {
            stream.write('A\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1\n');
        }
        console.log('STDOUT: ' + data);
    }
    
    // Func Handler 'handleWingsInstallationInput'
    function handleWingsInstallationInput(data, stream, domainnode, subdomain) {
        if (data.toString().includes('Input')) {
            stream.write('1\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${subdomain}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('user\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('1248\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write(`${domainnode}\n`);
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('admin@gmail.com\n');
        }
        if (data.toString().includes('Input')) {
            stream.write('y\n');
        }
        console.log('STDOUT: ' + data);
    }

    function handleNodeCreationInput(data, stream, domainnode, ramvps) {
        stream.write('iniwannbroku\n');
        stream.write('4\n');
        stream.write('SGP\n');
        stream.write('Autonode WannFyy\n');
        stream.write(`${domainnode}\n`);
        stream.write('NODES\n');
        stream.write(`${ramvps}\n`);
        stream.write(`${ramvps}\n`);
        stream.write('1\n');
        console.log('STDOUT: ' + data);
    }
  } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
bot.onText(/^(\.|\#|\/)wingsstart$/, async (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Format salah!\nPenggunaan: /wingsstart ipvps,password,token\nscript by @wannoffc08`);
  });
bot.onText(/\/wingsstart (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];
  const t = text.split(',');
  if (settings.adminId.includes(String(msg.from.id))) {
  if (t.length < 3) {
    return bot.sendMessage(chatId, 'Format salah!\nPenggunaan: /wingsstart ipvps,password,token\nscript by @wannoffc08');
  }
  const ipvps = t[0];
  const passwd = t[1];
  const token = t[2];
  const connSettings = {
    host: ipvps,
    port: 22,
    username: 'root',
    password: passwd
  };
    const conn = new Client();
    const command = 'bash <(curl -s https://raw.githubusercontent.com/wndrzzka/installer-pterodactlty/main/install.sh)'
 
    conn.on('ready', () => {
        isSuccess = true; // Set flag menjadi true jika koneksi berhasil
        sendMessage(chatId,' PROSES CONFIGURE WINGS\nscript by @wannoffc08')
        
        conn.exec(command, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream closed with code ${code} and ${signal} signal');
         sendMessage(chatId, 'SUCCES START WINGS DI PANEL ANDA COBA CEK PASTI IJO😁\nscript by @wannoffc08');
                conn.end();
            }).on('data', (data) => {
            stream.write('iniwannbroku\n');
                stream.write('3\n');
                stream.write(`${token}\n`)
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err) => {
        console.log('Connection Error: ' + err);
        sendMessage(chatId, 'Katasandi atau IP tidak valid');
    }).connect(connSettings);
     } else {
      bot.sendMessage(chatId, 'Fitur Ini Khusus Owner Saya!!!');
    }
});
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━