from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import datetime
import random
import logging
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv, find_dotenv, dotenv_values

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
root_env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
backend_env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(backend_env_path):
    load_dotenv(backend_env_path, override=True)
elif os.path.exists(root_env_path):
    load_dotenv(root_env_path, override=True)
else:
    load_dotenv(find_dotenv(), override=True)
try:
    cfg = dotenv_values(env_path)
    for k, v in cfg.items():
        if k and v and k not in os.environ:
            os.environ[k] = v
except Exception:
    pass

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info(f"Env PAYPAL_CLIENT_ID loaded: {bool(os.environ.get('PAYPAL_CLIENT_ID'))}")
logger.info(f"Env PAYPAL_SECRET loaded: {bool(os.environ.get('PAYPAL_SECRET'))}")

try:
    target = backend_env_path if os.path.exists(backend_env_path) else root_env_path
    if os.path.exists(target):
        with open(target, 'r', encoding='utf-8') as f:
            for line in f:
                s = line.strip()
                if not s or s.startswith('#') or '=' not in s:
                    continue
                k, v = s.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k.startswith('PAYPAL_') and k not in os.environ:
                    os.environ[k] = v
        logger.info("Manual .env load completed for PAYPAL_* keys")
except Exception as e:
    logger.error(f"Manual .env load error: {e}")

@app.route("/api/debug/env", methods=["GET"])
def debug_env():
    try:
        cid = os.environ.get("PAYPAL_CLIENT_ID")
        sec = os.environ.get("PAYPAL_SECRET")
        return jsonify({
            "PAYPAL_CLIENT_ID_present": bool(cid),
            "PAYPAL_SECRET_present": bool(sec),
            "PAYPAL_CLIENT_ID_length": len(cid) if cid else 0,
            "PAYPAL_SECRET_length": len(sec) if sec else 0,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def fetch_yahoo_finance(symbols):
    results = {}
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for symbol in symbols:
        try:
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=2d"
            logger.info(f"Fetching Yahoo Finance data for {symbol}...")
            
            response = requests.get(url, headers=headers)
            
            if response.status_code != 200:
                logger.error(f"Yahoo Finance error for {symbol}: {response.status_code}")
                continue
            
            data = response.json()
            result = data.get('chart', {}).get('result', [None])[0]
            
            if result:
                meta = result.get('meta', {})
                current_price = meta.get('regularMarketPrice', 0)
                previous_close = meta.get('chartPreviousClose', meta.get('previousClose', current_price))
                change = current_price - previous_close
                change_percent = (change / previous_close * 100) if previous_close else 0
                
                results[symbol] = {
                    'symbol': symbol,
                    'price': current_price,
                    'change': change,
                    'changePercent': change_percent,
                    'currency': meta.get('currency', 'USD'),
                    'marketState': meta.get('marketState', 'UNKNOWN'),
                    'timestamp': datetime.datetime.now().isoformat()
                }
                
                logger.info(f"{symbol}: ${current_price:.2f} ({'+' if change_percent >= 0 else ''}{change_percent:.2f}%)")
        except Exception as e:
            logger.error(f"Error fetching {symbol}: {e}")
            
    return results

def fetch_moroccan_stocks():
    results = {}
    moroccan_stocks = [
        { 'symbol': 'IAM', 'name': 'Maroc Telecom', 'isin': 'MA0000011488' },
        { 'symbol': 'ATW', 'name': 'Attijariwafa Bank', 'isin': 'MA0000012445' },
        { 'symbol': 'BCP', 'name': 'Banque Centrale Populaire', 'isin': 'MA0000010506' },
        { 'symbol': 'LHM', 'name': 'LafargeHolcim Maroc', 'isin': 'MA0000012320' },
    ]
    
    try:
        logger.info("Fetching Moroccan stocks data (Mocking)...")
        
        for stock in moroccan_stocks:
            try:
                # Mock logic from original code
                # In a real scenario, you would scrape or use an API
                
                # Base prices (approximate)
                base_prices = {
                    'IAM': 125.50,
                    'ATW': 485.00,
                    'BCP': 278.00,
                    'LHM': 1850.00
                }
                
                base_price = base_prices.get(stock['symbol'], 100.0)
                
                # Random variations
                price_variation = random.uniform(-1, 1)
                if stock['symbol'] == 'ATW': price_variation = random.uniform(-2.5, 2.5)
                elif stock['symbol'] == 'BCP': price_variation = random.uniform(-1.5, 1.5)
                elif stock['symbol'] == 'LHM': price_variation = random.uniform(-10, 10)
                
                change_percent_variation = random.uniform(-1, 1)
                
                current_price = base_price + price_variation
                change_percent = change_percent_variation
                change = (current_price * change_percent) / 100
                
                results[stock['symbol'] + '.MA'] = {
                    'symbol': stock['symbol'] + '.MA',
                    'name': stock['name'],
                    'price': round(current_price, 2),
                    'change': round(change, 2),
                    'changePercent': round(change_percent, 2),
                    'currency': 'MAD',
                    'market': 'Casablanca Stock Exchange',
                    'timestamp': datetime.datetime.now().isoformat()
                }
                
                logger.info(f"{stock['symbol']}.MA: {current_price:.2f} MAD")
                
            except Exception as e:
                logger.error(f"Error processing {stock['symbol']}: {e}")
                
    except Exception as e:
        logger.error(f"Error fetching Moroccan stocks: {e}")
        
    return results

def fetch_bvc_live():
    url = "https://www.casablanca-bourse.com/fr/live-market/transactions-actions"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    }
    try:
        logger.info("Fetching live BVC data...")
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            logger.error(f"BVC response status: {response.status_code}")
            return []
        soup = BeautifulSoup(response.text, "html.parser")
        table = soup.find("table")
        if table is None:
            logger.error("No table found on BVC page")
            return []
        body = table.find("tbody") or table
        rows = body.find_all("tr")
        results = []
        for row in rows:
            cells = row.find_all("td")
            if not cells:
                continue
            texts = [c.get_text(strip=True) for c in cells]
            symbol = texts[0] if len(texts) > 0 else ""
            name = texts[1] if len(texts) > 1 else ""
            last_price_raw = texts[2] if len(texts) > 2 else ""
            change_raw = texts[3] if len(texts) > 3 else ""
            change_pct_raw = texts[4] if len(texts) > 4 else ""
            volume_raw = texts[5] if len(texts) > 5 else ""
            def to_float(value):
                try:
                    cleaned = value.replace("\xa0", "").replace(" ", "").replace(",", ".")
                    return float(cleaned)
                except Exception:
                    return None
            def to_int(value):
                try:
                    cleaned = value.replace("\xa0", "").replace(" ", "").replace(",", "")
                    return int(cleaned)
                except Exception:
                    return None
            last_price = to_float(last_price_raw)
            change = to_float(change_raw)
            change_pct = to_float(change_pct_raw)
            volume = to_int(volume_raw)
            results.append(
                {
                    "symbol": symbol,
                    "name": name,
                    "lastPrice": last_price,
                    "change": change,
                    "changePercent": change_pct,
                    "volume": volume,
                }
            )
        logger.info(f"Fetched {len(results)} BVC rows")
        return results
    except Exception as e:
        logger.error(f"Error fetching BVC live data: {e}")
        return []

def get_paypal_access_token():
    client_id = os.environ.get("PAYPAL_CLIENT_ID")
    client_secret = os.environ.get("PAYPAL_SECRET")
    if not client_id or not client_secret:
        try:
            if os.path.exists(env_path):
                with open(env_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        s = line.strip()
                        if not s or s.startswith('#') or '=' not in s:
                            continue
                        k, v = s.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k == "PAYPAL_CLIENT_ID":
                            client_id = v
                        elif k == "PAYPAL_SECRET":
                            client_secret = v
        except Exception as e:
            logger.error(f"manual env parse error: {e}")
    base = os.environ.get("PAYPAL_BASE_URL", "https://api-m.sandbox.paypal.com")
    if not client_id or not client_secret:
        raise Exception("PAYPAL_CLIENT_ID or PAYPAL_SECRET not set")
    resp = requests.post(
        f"{base}/v1/oauth2/token",
        auth=(client_id, client_secret),
        headers={"Accept": "application/json", "Accept-Language": "en_US"},
        data={"grant_type": "client_credentials"},
        timeout=15,
    )
    if resp.status_code != 200:
        raise Exception(f"PayPal token error: {resp.status_code} {resp.text}")
    return resp.json().get("access_token"), base

@app.route("/api/paypal/create-order", methods=["POST"])
def paypal_create_order():
    try:
        payload = request.get_json() or {}
        amount = str(payload.get("amount", "10"))
        currency = payload.get("currency", "USD")
        return_url = payload.get("return_url", f"{request.host_url.strip('/')}/checkout")
        cancel_url = payload.get("cancel_url", f"{request.host_url.strip('/')}/checkout")

        token, base = get_paypal_access_token()
        order_payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": currency,
                        "value": amount,
                    }
                }
            ],
            "application_context": {
                "return_url": return_url,
                "cancel_url": cancel_url,
            },
        }
        resp = requests.post(
            f"{base}/v2/checkout/orders",
            json=order_payload,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
            timeout=15,
        )
        if resp.status_code not in (200, 201):
            logger.error(f"PayPal create order error: {resp.status_code} {resp.text}")
            return jsonify({"success": False, "error": resp.text}), 400
        data = resp.json()
        approve = next((l["href"] for l in data.get("links", []) if l.get("rel") == "approve"), None)
        return jsonify({"success": True, "order_id": data.get("id"), "approve_url": approve})
    except Exception as e:
        logger.error(f"Error creating PayPal order: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/paypal/capture-order", methods=["POST"])
def paypal_capture_order():
    try:
        payload = request.get_json() or {}
        order_id = payload.get("order_id")
        if not order_id:
            return jsonify({"success": False, "error": "order_id required"}), 400
        token, base = get_paypal_access_token()
        resp = requests.post(
            f"{base}/v2/checkout/orders/{order_id}/capture",
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
            timeout=15,
        )
        if resp.status_code not in (200, 201):
            logger.error(f"PayPal capture error: {resp.status_code} {resp.text}")
            return jsonify({"success": False, "error": resp.text}), 400
        data = resp.json()
        status = data.get("status")
        captures = []
        try:
            captures = data["purchase_units"][0]["payments"]["captures"]
        except Exception:
            captures = []
        return jsonify({"success": True, "status": status, "captures": captures})
    except Exception as e:
        logger.error(f"Error capturing PayPal order: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/market-data', methods=['POST'])
def market_data():
    try:
        data = request.get_json()
        symbols = data.get('symbols', [])
        market = data.get('market', 'all')
        
        logger.info(f"Market data request: market={market}, symbols={symbols}")
        
        response_data = {}
        
        if market in ['morocco', 'all']:
            moroccan_data = fetch_moroccan_stocks()
            response_data.update(moroccan_data)
            
        if market in ['international', 'all']:
            default_symbols = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'BTC-USD', 'ETH-USD']
            target_symbols = symbols if symbols else default_symbols
            yahoo_data = fetch_yahoo_finance(target_symbols)
            response_data.update(yahoo_data)
            
        return jsonify({
            'success': True,
            'data': response_data,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in market-data endpoint: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/bvc/live', methods=['GET'])
def bvc_live():
    try:
        data = fetch_bvc_live()
        return jsonify(
            {
                "success": True,
                "data": data,
                "timestamp": datetime.datetime.now().isoformat(),
            }
        )
    except Exception as e:
        logger.error(f"Error in bvc live endpoint: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
