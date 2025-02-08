from bs4 import BeautifulSoup
import requests
from concurrent.futures import ThreadPoolExecutor
import os
from dotenv import load_dotenv
from ThePlaylist import ply

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

def init_list(year:str,month:str):
    try:
        response=session.get(f'{YEAR_URL}/{year}/{month}',timeout=10)
        response.raise_for_status()
        soup=BeautifulSoup(response.content, 'html.parser')
        articles=soup.find_all('article')
        titles=[]
        for article in articles:
            title=article.find('h2').text.replace('|','').replace('VIDEO','').replace('AUDIO','').replace('Download','').strip()
            titles.append(title)
        return {
            'total':len(titles),
            'playlist':titles
        }
    except Exception as e:
        # print("init list error",e)
        return {}


count = 0
def djm(year:str,month:str)->list:
    global count
    print("Called djm: ",count)
    try:
        response=session.get(f'{YEAR_URL}/{year}/{month}',timeout=10)
        response.raise_for_status()
        soup=BeautifulSoup(response.content, 'html.parser')
        articles=soup.find_all('article')
        songs=[]
        for article in articles:
            url=article.find('a')['href']
            if count>0:
                category=article.find('li')
                if category:
                    category=category.text.lower().strip()
                    if category=='video':
                        continue
                else:
                    continue
            else:
                title=article.find('h2').text.replace('|','').replace('AUDIO','').replace('Download','').strip()
                if 'VIDEO' in title:
                    continue
            # print(title,url)
            # print(url)
            song=specific_song(url)
            if song:
                songs.append(song)
                # ply.add_at_end(song)
                # print(song['title'])
            else:
                continue
        ply.add(songs)
        count+=1
    except Exception as e:
        # print("djm error",e)
        return {}

def specific_song(url:str)->dict:
    try:
        response=session.get(url,timeout=10)
        response.raise_for_status()
        soup=BeautifulSoup(response.content, 'html.parser')
        title=soup.find('h1').text.replace('AUDIO','').replace('|','').replace('Download','').strip()
        image_url=soup.find('img',class_='attachment-post-thumbnail')['src']
        audio_url=soup.find('div', class_='entry-content').find('a')['href']
        return {'title':title ,'audio': audio_url,'image': image_url,}
    except Exception as e:
        # print('specific_song error',e)
        return {}


def fetch_page(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = session.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException:
        return None

def process_article(article):
    # title = article.find('h2').text.replace('|', '').replace('Download', '').strip()
    category=article.find('li')
    if category:
        category=category.text.lower().strip()
        if category=='audio' or category=='dj-mixes' or category=='instrumentals':
            # print(category)
            # title = title.replace('AUDIO', '').strip()
            # if article.find('p') and ']' in article.find('p').text:
                # audio_url = article.find('p').text.split(']')[-1].strip()
                # image_url = article.find('img')['src']
                # if audio_url and image_url:
                    # return {'title': title, 'audio': audio_url, 'image': image_url}
            url=article.find('a')['href']
            # print(url)
            song=specific_song(url)
            if song:
                print(song)
                return song
    return None

def search_djm(keywords: str = 'diamond') -> list:
    keywords = keywords.replace(' ', '+')
    url = f'{KEYWORDS_URL}={keywords.replace(" ", "+")}'
    print(url)
    page_content = fetch_page(url)
    if not page_content:
        return []
    soup = BeautifulSoup(page_content, 'html.parser')
    articles = soup.find_all('article')

    songs = []
    with ThreadPoolExecutor() as executor:
        results = executor.map(process_article, articles)
        songs = [song for song in results if song]  # Filter out None values
        # print(songs)
    # return songs
    ply.add_t(songs)



def find_page_number()->int:
    pass

def main():
    pass
    # print(init_list('2025','02'))
    while count<5:
        djm('2025','02')
    # print(search_djm('prof'))


if __name__ == "__main__":
    main()