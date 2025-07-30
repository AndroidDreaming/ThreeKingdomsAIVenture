import os
from flask import Flask, jsonify, request, send_from_directory
import requests
from dotenv import load_dotenv

# 加载 .env 文件中的环境变量
load_dotenv()

app = Flask(__name__, static_folder='static') # 'static' 是存放前端静态文件的地方

# --- 1. 静态文件服务 (与之前相同) ---
# 当访问根路径 '/' 时，返回 static 文件夹中的 index.html
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# --- 2. 实现 config.js 的逻辑 ---
# 对应你的 /api/config 接口
@app.route('/api/config', methods=['GET'])
def get_config():
    if request.method != 'GET':
        return jsonify(error='Method not allowed'), 405

    try:
        config = {
            'defaultModel': os.getenv('AI_DEFAULT_MODEL', 'DeepSeek-R1-0528'),
            'apiUrl': os.getenv('AI_API_URL', 'https://chatapi.akash.network/api/v1'),
            'hasApiKey': bool(os.getenv('AI_API_KEY')) # 检查 API_KEY 是否存在
        }
        return jsonify(config), 200
    except Exception as e:
        print(f'Config API error: {e}')
        return jsonify(error='Failed to get config', message=str(e)), 500

# --- 3. 实现 models.js 的逻辑 ---
# 对应你的 /api/models 接口
@app.route('/api/models', methods=['GET'])
def get_models():
    if request.method != 'GET':
        return jsonify(error='Method not allowed'), 405

    try:
        api_url = os.getenv('AI_API_URL', 'https://chatapi.akash.network/api/v1')
        api_key = os.getenv('AI_API_KEY')

        # 如果是 Pollinations.ai，返回预定义的模型列表
        if 'pollinations.ai' in api_url:
            pollinations_models = {
                'data': [
                    {'id': 'openai', 'object': 'model', 'created': 0, 'owned_by': 'pollinations'},
                    {'id': 'mistral', 'object': 'model', 'created': 0, 'owned_by': 'pollinations'},
                    {'id': 'claude', 'object': 'model', 'created': 0, 'owned_by': 'pollinations'}
                ]
            }
            return jsonify(pollinations_models), 200

        if not api_key:
            return jsonify(error='API key not configured'), 500

        models_url = f"{api_url}/models"
        headers = {'Authorization': f'Bearer {api_key}'}

        response = requests.get(models_url, headers=headers, timeout=10) # 设置超时
        response.raise_for_status() # 如果请求不成功（4xx, 5xx），会抛出异常

        return jsonify(response.json()), 200

    except requests.exceptions.Timeout:
        print('Models API error: Request timeout')
        return jsonify(error='Failed to fetch models', message='Request timeout'), 500
    except requests.exceptions.RequestException as e:
        print(f'Models API error: {e}')
        return jsonify(error='Failed to fetch models', message=str(e)), 500
    except Exception as e:
        print(f'Models API error: {e}')
        return jsonify(error='Failed to fetch models', message=str(e)), 500

# --- 4. 实现 chat.js 的逻辑 (大致思路) ---
# 对应你的 /api/chat 接口
@app.route('/api/chat', methods=['POST'])
def chat_completion():
    if request.method != 'POST':
        return jsonify(error='Method not allowed'), 405

    try:
        data = request.get_json()
        prompt = data.get('prompt')
        model = data.get('model')

        if not prompt:
            return jsonify(error='Prompt is required'), 400

        api_url = os.getenv('AI_API_URL', 'https://chatapi.akash.network/api/v1')
        api_key = os.getenv('AI_API_KEY')
        default_model = os.getenv('AI_DEFAULT_MODEL', 'DeepSeek-R1-0528')

        if not api_key:
            return jsonify(error='API key not configured'), 500

        selected_model = (model.strip() if model else default_model) or default_model # 确保模型不为空

        final_api_url = f"{api_url.strip()}/chat/completions"

        if 'pollinations.ai' in api_url:
            final_api_url = api_url.strip()

        headers = {'Content-Type': 'application/json'}
        request_body = {}

        if 'pollinations.ai' in api_url:
            if api_key and api_key != 'not-required':
                headers['Authorization'] = f'Bearer {api_key}'
            messages = [
                {'role': 'system', 'content': 'You must respond with valid JSON format only. Do not include any text outside the JSON structure.'},
                {'role': 'user', 'content': prompt}
            ]
            import random # 导入random模块
            request_body = {
                'model': selected_model or 'openai',
                'messages': messages,
                'seed': random.randint(0, 999) # 使用random.randint生成随机种子
            }
        else:
            headers['Authorization'] = f'Bearer {api_key}'
            request_body = {
                'model': selected_model,
                'messages': [{'role': 'user', 'content': prompt}],
                'response_format': {'type': "json_object"},
                'max_tokens': 4000,
                'temperature': 0.7,
                'stream': False
            }
        
        response = requests.post(final_api_url, headers=headers, json=request_body, timeout=50) # 50秒超时
        response.raise_for_status()

        return jsonify(response.json()), 200

    except requests.exceptions.Timeout:
        print('Chat API error: Request timeout')
        return jsonify(error='Internal server error', message='Request timeout - AI API took too long to respond'), 500
    except requests.exceptions.RequestException as e:
        print(f'Chat API error: {e}')
        return jsonify(error='Internal server error', message=str(e)), 500
    except Exception as e:
        print(f'Chat API error: {e}')
        return jsonify(error='Internal server error', message=str(e)), 500

# --- 5. 实现 image.js 的逻辑 (大致思路) ---
# 对应你的 /api/image 接口
@app.route('/api/image', methods=['POST'])
def generate_image():
    if request.method != 'POST':
        return jsonify(error='Method not allowed'), 405

    try:
        data = request.get_json()
        prompt = data.get('prompt')
        width = data.get('width')
        height = data.get('height')
        model = data.get('model')
        seed = data.get('seed')
        nologo = data.get('nologo')
        enhance = data.get('enhance')
        safe = data.get('safe')

        if not prompt:
            return jsonify(error='Prompt is required'), 400

        image_api_url = os.getenv('IMAGE_API_URL', 'https://image.pollinations.ai')
        image_api_key = os.getenv('IMAGE_API_KEY')
        image_referrer = os.getenv('IMAGE_REFERRER')
        default_model = os.getenv('IMAGE_DEFAULT_MODEL', 'flux')

        selected_model = (model.strip() if model else default_model) or default_model

        base_url = f"{image_api_url.strip()}/prompt/{requests.utils.quote(prompt)}"
        
        params = {
            'model': selected_model,
            'width': width or '800',
            'height': height or '600'
        }
        if seed: params['seed'] = seed
        if nologo is True or nologo == 'true': params['nologo'] = 'true'
        if enhance is True or enhance == 'true': params['enhance'] = 'true'
        if safe is True or safe == 'true': params['safe'] = 'true'
        if image_referrer: params['referrer'] = image_referrer # Pollinations referrer

        headers = {}
        if image_api_key:
            headers['Authorization'] = f'Bearer {image_api_key}'
        if image_referrer: # Referrer也可以放在headers里，但Pollinations通常通过URL参数处理
            headers['Referer'] = image_referrer 

        # 构建最终URL，requests会自动处理参数编码
        response = requests.get(base_url, headers=headers, params=params, timeout=60) # 60秒超时
        response.raise_for_status()

        content_type = response.headers.get('content-type')
        if not content_type or not content_type.startswith('image/'):
            raise ValueError('Invalid response: Expected image data')
        
        # 注意：这里的 image.js 原始逻辑是返回一个 JSON 包含 imageUrl
        # 而不是直接返回图片本身。如果你需要直接返回图片二进制，需要修改
        return jsonify({
            'success': True,
            'imageUrl': response.url, # 返回实际请求的URL，它包含了图片
            'model': selected_model,
            'prompt': prompt,
            'parameters': {
                'width': width or '800',
                'height': height or '600',
                'seed': seed,
                'nologo': nologo or False,
                'enhance': enhance or False,
                'safe': safe or False
            }
        }), 200

    except requests.exceptions.Timeout:
        print('Image API error: Request timeout')
        return jsonify(error='Internal server error', message='Request timeout - Image generation took too long'), 500
    except requests.exceptions.RequestException as e:
        print(f'Image API error: {e}')
        return jsonify(error='Internal server error', message=str(e)), 500
    except Exception as e:
        print(f'Image API error: {e}')
        return jsonify(error='Internal server error', message=str(e)), 500


if __name__ == '__main__':
    # 运行 Flask 应用，监听所有 IP 地址 (0.0.0.0) 的 8111 端口
    # 在生产环境，通常会使用 Gunicorn 等 WSGI 服务器来运行 Flask
    app.run(host='0.0.0.0', port=8111, debug=True) # debug=True 可以在开发时看到更详细的错误信息