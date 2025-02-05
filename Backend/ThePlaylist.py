import time
from findlist import djm as  get_songs, search_djm as search_songs
import urllib

class Node:
    def __init__(self,song=None,next=None,prev=None):
        self.song=song
        self.next=next
        self.prev=prev

class Playlist:
    def __init__(self):
        self.head=None

    def add_at_end(self,song):
        if self.head is None:
            self.head=Node(song,None,None)
            return
        last=self.head
        while last.next:
            last=last.next
        last.next=Node(song,None,last)


    # def remove_at_end(self,song):
    #     if self.head is None:
    #         return
    #     if self.head and self.head.song==song:
    #         self.head=self.head.next
    #         if self.head:
    #             self.head.prev=None
    #         return
    #     current=self.head
    #     while current:
    #         if current.next and current.next.song == song:
    #             current.next=current.next.next
    #             if current.next:
    #                 current.next.prev=current
    #             break
    #         current=current.next
    def add(self,songs:list):
        for song in songs:
            self.add_at_end(song)
    # def remove(self,songs:list):
    #     for song in songs:
    #         self.remove_at_end(song)

    # def get_last_song(self):
    #     last=self.head
    #     while last.next:
    #         last=last.next
    #     return last

    # def play(self,song=None,mode="forward"):
    #     if self.head is None:

    #         print("\n\n❌ PLAYLIST IS EMPTY\n")
    #     if song is None:
    #         current=self.head
    #         if mode=="backward":
    #             last=self.get_last_song()
    #             while last:
    #                 print(f"""[▶️ PLAYING NOW][{last.song}]""")
    #                 time.sleep(5)
    #                 last=last.prev
    #             print("[⏯️ PLAYLIST ENDED]")
    #         else:
    #             while current:
    #                 print(f"""[▶️ PLAYING NOW][{current.song}]""")
    #                 time.sleep(5)
    #                 current=current.next
    #             print("[⏯️ PLAYLIST ENDED]")
    #     else:
    #         current=self.head
    #         if current.song==song:
    #             print(f"""[▶️ PLAYING NOW][{current.song}]""")
    #             time.sleep(1)
    #             print("[⏯️ SONG ENDED]")
    #             return
    #         while current:
    #             if current.next.song==song:
    #                 print(f"""[▶️ PLAYING NOW][{current.next.song}]""")
    #                 time.sleep(1)
    #                 print("[⏯️ SONG ENDED]")
    #                 return
    #             current=current.next


    def len(self):
        count=0
        current=self.head
        while current:
            count+=1
            current=current.next
        return count
    def display(self):
        if self.head is None:
            return []
        current=self.head
        songs=[]
        while current:
            songs.append(current.song)
            current=current.next
        return songs

    # def encode_url(self,title):
    #     """Encodes a song title into a valid URL format."""
    #     if not title:
    #         return ""
    #     return f"https://dl.globalkiki.com/uploads/{urllib.parse.quote(title.replace('.',''))}.mp3"
    # def get_json(self):
    #     if self.head is None:
    #         return []

    #     songs = []
    #     current = self.head
    #     last_song = self.get_last_song()
    #     first_song = self.head

    #     while current:
    #         # Ensure values are always strings, even if None
    #         song_title = str(current.song) if current.song else ''
    #         prev_song_title = str(current.prev.song) if current.prev and current.prev.song else str(last_song.song) if last_song and last_song.song else ""
    #         next_song_title = str(current.next.song) if current.next and current.next.song else str(first_song.song) if first_song and first_song.song else ""

    #         songs.append({
    #             "song": {
    #                 'title': song_title,
    #                 'url': self.encode_url(song_title),
    #                 'image': "https://djmwanga.com/wp-content/uploads/2025/02/The-Ben-Ft-Marioo-%E2%80%93-Baby.jpg"
    #             },
    #             "prev": {
    #                 'title': prev_song_title,
    #                 'url': self.encode_url(prev_song_title),
    #                 'image': "https://djmwanga.com/wp-content/uploads/2025/02/The-Ben-Ft-Marioo-%E2%80%93-Baby.jpg"
    #             },
    #             "next": {
    #                 'title': next_song_title,
    #                 'url': self.encode_url(next_song_title),
    #                 'image': "https://djmwanga.com/wp-content/uploads/2025/02/The-Ben-Ft-Marioo-%E2%80%93-Baby.jpg"
    #             }
    #         })

    #         current = current.next

    #     return songs

def main(category='audio',searching=False,keyword=None):

    playlist=Playlist()

    if searching:
        playlist.add(search_songs(keywords=keyword))
    playlist.add(get_songs(category))
    songs=playlist.display()
    # song_node=playlist.get_json()
    total=playlist.len()

    # playlist.remove(get_songs('dj-mixes'))
    # playlist.display()
    # playlist.play()
    # print(playlist.get_json())
    return total, songs

if __name__=="__main__":
    main()