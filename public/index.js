const { KeyPair, get_languages } = wasm_bindgen;

// initialize elements for easier access and reuse
const lbl_testnet = document.getElementById("lbl_testnet");
const address_value = document.getElementById("address_value");
const private_key_value = document.getElementById("private_key_value");
const seed_value_line_1 = document.getElementById("seed_value_line_1");
const seed_value_line_2 = document.getElementById("seed_value_line_2");
const qrcode_address_img = document.getElementById("qrcode_address_img");
const qrcode_private_key_img = document.getElementById("qrcode_private_key_img");
const btn_generate = document.getElementById("btn_generate");
const select_bg = document.getElementById("select_bg");
const bg_img = document.getElementById("bg_img");
const select_network = document.getElementById("select_network");
const txt_amount = document.getElementById("txt_amount");
const lbl_amount = document.getElementById("lbl_amount");
const lbl_amount_value = document.getElementById("lbl_amount_value");
const select_language = document.getElementById("select_language");
const footer_msg = document.getElementById("footer_msg");
const btn_download = document.getElementById("btn_download");
const modal_download = document.getElementById("modal_download");

// load wasm wallet and generate wallet seed right away
async function load() {
  await wasm_bindgen();

  const languages = get_languages();
  languages.forEach((lang, idx) => {
    const option = document.createElement(`option`);
    option.value = idx;
    option.text = lang;
    select_language.append(option);
  });

  generate_wallet();
}

load();

function generate_wallet() {
  const network = select_network.value;

  const mainnet = network === "mainnet";
  if (mainnet) {
    lbl_testnet.classList.add("hidden");
  } else {
    lbl_testnet.classList.remove("hidden");
  }

  const language_idx = select_language.value;

  const key_pair = new KeyPair(mainnet);
  const addr = key_pair.address();
  const private_key = key_pair.secret();
  const seed = key_pair.seed(language_idx);

  set_address_qrcode(addr);
  set_private_key_qrcode(private_key);

  address_value.textContent = addr;
  private_key_value.textContent = private_key;
  seed_value_line_1.textContent = seed.splice(0, 12).join(" ");
  seed_value_line_2.textContent = seed.splice(0, 13).join(" ");
}

function set_address_qrcode(value) {
  var qr = new QRious({
    background: 'white',
    backgroundAlpha: 1,
    foreground: 'black',
    foregroundAlpha: 1,
    level: 'H',
    padding: 25,
    size: 500,
    value: value
  });

  qrcode_address_img.setAttribute('xlink:href', qr.toDataURL());
}

function set_private_key_qrcode(value) {
  var qr = new QRious({
    background: 'white',
    backgroundAlpha: 1,
    foreground: 'black',
    foregroundAlpha: 1,
    level: 'H',
    padding: 25,
    size: 500,
    value: value
  });

  qrcode_private_key_img.setAttribute('xlink:href', qr.toDataURL());
}

btn_generate.addEventListener('click', async () => {
  generate_wallet();
});

select_network.addEventListener('change', (e) => {
  generate_wallet();
});

select_bg.addEventListener('change', (e) => {
  bg_img.setAttribute("xlink:href", e.target.value);
});

txt_amount.addEventListener('input', (e) => {
  const value = e.target.value;
  if (value.length > 0) {
    lbl_amount.classList.remove("hidden");
    lbl_amount_value.textContent = e.target.value;
  } else {
    lbl_amount.classList.add("hidden");
  }
});

function translate_app(lang) {
  const elements = document.body.querySelectorAll('[data-t], [data-t-title], [data-t-placeholder]');
  elements.forEach((element) => {
    let en_text = element.getAttribute('data-t');
    if (en_text) element.textContent = translate_text(en_text, lang);

    en_text = element.getAttribute('data-t-title');
    if (en_text) element.title = translate_text(en_text, lang);

    en_text = element.getAttribute('data-t-placeholder');
    if (en_text) element.placeholder = translate_text(en_text, lang);
  });
}

select_language.addEventListener('change', (e) => {
  generate_wallet();
  const element = e.target;
  const lang = element.options[element.selectedIndex].text;
  translate_app(lang.toLowerCase());
});

// hide bottom msg and display download button if loaded from webserver instead of an app
if (window.__TAURI__) {
  footer_msg.classList.add("hidden");
  btn_download.classList.add("hidden");
}

function on_download_button() {
  window.open("https://github.com/xelis-project/xelis-paper-wallet/releases", "_blank");
}

// hide modal when click outside of .modal-content
modal_download.addEventListener('click', (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    modal_download.classList.add("hidden");
  }
});