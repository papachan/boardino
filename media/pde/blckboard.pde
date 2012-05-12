// Post-it WhiteBoard
/* @pjs preload="/media/postit.gif"; */
String postit_image_url = "/media/postit.gif";
HashMap postits;

void setup(){
  size(800, 400);
  postits = new HashMap();
  loadBoard();
}

void draw(){
    background(255);
    Iterator i = postits.entrySet().iterator();
    while (i.hasNext()) {
        Map.Entry entry = (Map.Entry)i.next();
        PostIt postit = (PostIt)entry.getValue();
        postit.show();
    }
}

void addPostIt(int id, String text, float x, float y){
    postits.put(id, new PostIt(id, text, x, y));
}

class PostIt{
  int id;
  float x, y;
  PImage postit_i;
  String feed;

  PostIt(int id, String text, float x, float y){
    this.id = id;
    this.feed = text;
    this.x = x;
    this.y = y;
    postit_i = loadImage(postit_image_url);
    postit_i.resize(0, height/4);
  }

  PostIt(int id, String text){
    this(id, text, width/2, height/2);
  }
  
  void show(){
    image(postit_i, x, y);
    fill(0);
    text(feed, x+15, y+50);
  }
  
  boolean clicked(){
    if (mouseX > x && mouseX < (postit_i.width + x)){
      if (mouseY > y && mouseY < (postit_i.height + y)){
        return true;
      }
    }
    return false;
  }
  
  void move(float x, float y){
    this.x = x;
    this.y = y;
  }
  
}

void movePostIt(int id, int x, int y){
    postits.get(id).move(x, y);
}

void mouseDragged(){
    Iterator i = postits.entrySet().iterator();
    while (i.hasNext()) {
        Map.Entry entry = (Map.Entry)i.next();
        PostIt postit = (PostIt)entry.getValue();
        if (postit.clicked()){
            postit.move(mouseX - postit.postit_i.width/2, mouseY - postit.postit_i.height/2);
            onPostItMoved(postit.id, postit.x, postit.y);
        }
    }
}