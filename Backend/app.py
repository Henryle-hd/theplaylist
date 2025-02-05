from flask import Flask, request
from ThePlaylist import main
from flask_cors import CORS
import time


app=Flask(__name__)
CORS(app)

@app.route('/playlist')
def playlist():
    keyword=request.args.get('keyword')
    if keyword:
        total, songs=main(searching=True,keyword=keyword)
    else:
        total, songs=main()
    return {
        'total': total,
        'playlist': songs
    }

# @app.route('/songnodes')
# def songnodes():
#     return song_nodes


if __name__=="__main__":
    app.run(host='192.168.1.2',port='8080',debug=True)
