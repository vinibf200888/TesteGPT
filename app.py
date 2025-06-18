from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)


def scrape_news(url):
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
    except Exception as e:
        return [f"Erro ao acessar a página: {e}"]

    soup = BeautifulSoup(resp.text, 'html.parser')
    headlines = []

    # Collect common headline tags
    for tag in soup.find_all(['h1', 'h2', 'h3']):
        text = tag.get_text(strip=True)
        if text and len(text) > 20:
            headlines.append(text)

    # Fallback to anchor tags if very few headlines found
    if len(headlines) < 3:
        for a in soup.find_all('a'):
            text = a.get_text(strip=True)
            if text and len(text) > 20:
                headlines.append(text)

    return headlines if headlines else ["Nenhuma notícia encontrada."]


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        url = request.form.get('url')
        news = scrape_news(url)
        return render_template('results.html', url=url, news=news)
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
