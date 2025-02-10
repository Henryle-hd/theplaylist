from random import shuffle
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

    def add_at_start(self, song):
        new_node = Node(song, next=self.head, prev=None)
        if self.head is not None:
            self.head.prev = new_node  # Update the previous head's prev pointer
        self.head = new_node  # Move head to the new node

    def add(self,songs:list):
        for song in songs:
            self.add_at_end(song)

    def add_t(self,songs:list):
        for song in songs:
            self.add_at_start(song)
    def len(self):
        count=0
        current=self.head
        while current:
            count+=1
            current=current.next
        return count
    
    def remove_at_end(self):
        if self.head is None:
            return
        current=self.head
        while current:
            if current.next:
                current.next=current.next.next
                if current.next:
                    current.next.prev=current
                break
            current=current.next

    def display(self):
        if self.head is None:
            return []
        current=self.head
        songs=[]
        while current:
            songs.append(current.song)
            current=current.next
        shuffle(songs)
        return songs

ply=Playlist()

def main():
    # ply.add(['Song1','Song2','Song3'])
    # ply.add_at_start('Song0')
    # ply.__init__()
    # ply.add_at_start('Song0')
    # print(ply.display())
    # print(ply.len())
    pass

if __name__ == "__main__":
    main()