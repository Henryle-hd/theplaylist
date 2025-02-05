from bs4 import BeautifulSoup
import requests
from concurrent.futures import ThreadPoolExecutor
import os
from dotenv import load_dotenv

load_dotenv()

CATEGORY_URL=os.getenv('CATEGORY_URL')
YEAR_URL=os.getenv('YEAR_URL')
KEYWORDS_URL=os.getenv('KEYWORDS_URL')

CATEGOTY=['dj-mixes','new-audio','nyimbo-za-dini','audio','instrumentals']


session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0"
})

def get_songs(category:str='audio'):
    category = category.replace(' ','-').lower().strip()

    if category in CATEGOTY:
        try:
            response=session.get(f'{CATEGORY_URL}/{category}',timeout=10)
            soup=BeautifulSoup(response.content, 'html.parser')
            soup.find_all('article')
            songs=[]
            for song in soup.find_all('article'):
                title=song.find('h2').text.replace('|','').replace('AUDIO','').replace('Download','').strip()
                songs.append(title)
            return songs
        except Exception as e:
            print(e)
    else:
        print("category not found")

def cmzk(category:str='audio'):
    pass

def djm(year:str,month:str)->list:
    try:
        response=session.get(f'{YEAR_URL}/{year}/{month}',timeout=10)
        response.raise_for_status()
        soup=BeautifulSoup(response.content, 'html.parser')
        articles=soup.find_all('article')
        songs=[]
        for article in articles:
            title=article.find('h2').text.replace('|','').replace('AUDIO','').replace('Download','').strip()
            if 'VIDEO' in title:
                continue
            song=specific_song(title,year,month)
            if song:
                songs.append(song)
            else:
                continue
        return songs
    except Exception as e:
        return []


def fetch_page(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = session.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException:
        return None

def process_article(article):
    title = article.find('h2').text.replace('|', '').replace('Download', '').strip()
    if 'AUDIO' in title:
        title = title.replace('AUDIO', '').strip()
        if article.find('p') and ']' in article.find('p').text:
            audio_url = article.find('p').text.split(']')[-1].strip()
            image_url = article.find('img')['src']
            if audio_url and image_url:
                return {'title': title, 'audio': audio_url, 'image': image_url}
    return None

def search_djm(keywords: str = 'diamond') -> list:
    url = f'{KEYWORDS_URL}={keywords.replace(" ", "+")}'
    page_content = fetch_page(url)

    if not page_content:
        return []

    soup = BeautifulSoup(page_content, 'html.parser')
    articles = soup.find_all('article')

    songs = []
    with ThreadPoolExecutor() as executor:
        results = executor.map(process_article, articles)
        songs = [song for song in results if song]  # Filter out None values

    return songs

def specific_song(title:str,year:str,month:str)->dict:
    url=f'{YEAR_URL}/{year}/{month}/'+title.replace('.','').replace(' – ','-').replace(' ','-').lower()+'.html'
    try:
        response=session.get(url,timeout=10)
        soup=BeautifulSoup(response.content, 'html.parser')
        image_url=soup.find('img',class_='attachment-post-thumbnail')['src']
        audio_url=soup.find('div', class_='entry-content').find('a')['href']
        return {'title':title ,'audio': audio_url,'image': image_url,}
    except Exception as e:
        return {}



def main():
    pass
    # print(djm('audio'))
    # print(search_djm('diamond'))
    # print(specific_song('Phina X ICent – Wanita'))


if __name__ == "__main__":
    main()