from flask import Flask, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from findlist import djm as  get_init_songs, search_djm as search_songs,init_list
import time
import random
from ThePlaylist import ply
from random import shuffle
import threading

load_dotenv()
PORT=os.getenv('PORT')
HOST=os.getenv('HOST')

app=Flask(__name__)
CORS(app)


def get_year_month():
    current_time = time.localtime()
    year = current_time.tm_year
    month = current_time.tm_mon
    random_year = random.randint(2023, year)
    random_month = random.randint(1, 12) if random_year < year else random.randint(1, month)
    ym=str(random_year), str(random_month).zfill(2)
    # print(ym)
    return ym


def change_init_list():
    global year,month
    while True:
        time.sleep(86400)
        year,month=get_year_month()
        get_init_songs(year=year,month=month)
#init
year,month=get_year_month()
get_init_songs(year=year,month=month)
#background
update_list_thread=threading.Thread(target=change_init_list,daemon=True)
update_list_thread.start()


@app.route('/playlist')
def playlist():
    global year,month
    keyword = request.args.get('keyword')
    # print(f"Keyword received: {keyword}")
    if keyword:
        ply.__init__()
        search_songs(keywords=keyword)
    else:
        if ply.len()<1:
            # year,month=get_year_month()
            # get_init_songs(year=year,month=month)
            # shuffle(ply.display())
            pass
    return {
        'total': ply.len(),
        'playlist':ply.display()
        }

@app.route('/selected_songs')
def selected_songs():
    return init_list(year,month)

# @app.route('/songnodes')
# def songnodes():
#     return song_nodes


if __name__=="__main__":
    app.run(host=HOST,port=PORT,debug=False)
