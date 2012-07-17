// Post-it WhiteBoard
/* @pjs preload="/media/postit.gif"; */
String postit_image_url = "/media/postit.gif";
HashMap postits;
PostIt selectedPostIt;

void setup(){
  size(800, 400);
  frameRate(15);
  postits = new HashMap();
  loadBoard();
}

void draw(){
    background(59,101,61);
    Iterator i = postits.entrySet().iterator();
    while (i.hasNext()) {
        Map.Entry entry = (Map.Entry)i.next();
        PostIt postit = (PostIt)entry.getValue();
        postit.show();
    }
}

JavaScript javaScript;

interface JavaScript{
    void onNewPostit(float x, float y, String feed);
    void onPostitMoved(int id, float x, float y);
    void onPostitSelected(int id);
}

void bindJavaScript(JavaScript js){
    javaScript = js;
}

void addPostIt(int id, String text, int x, int y){
    postits.put(id, new PostIt(id, text, x, y));
}

class PostIt{
    int id;
    float x, y;
    PImage postit_i;
    String feed;
    boolean selected = false;
    boolean friendSelected = false;

    PostIt(int id, String text, float x, float y){
        this.id = id;
        this.feed = text;
        this.x = x;
        this.y = y;
        postit_i = loadImage(postit_image_url);
        postit_i.resize(0, height/4);
        this.selected = false;
    }

  PostIt(int id, String text){
    this(id, text, width/2, height/2);
  }
  
  void show(){
    if (isNew()){
        rect(x, y, postit_i.width, postit_i.height);
    }
    if(selected){
        rect(x, y, postit_i.width, postit_i.height);
    }
    if(friendSelected){
        fill(color(200, 0, 0));
        rect(x, y, postit_i.width, postit_i.height);
    }
    image(postit_i, x, y);
    fill(0);
    text(feed, x+15, y+50);
  }

  boolean isNew(){
    return id==9999;
  }
  
  boolean hovered(){
    if (mouseX > x && mouseX < (postit_i.width + x)){
      if (mouseY > y && mouseY < (postit_i.height + y)){
        return true;
      }
    }
    return false;
  }
  
  void select(){
    this.selected = true;
  }

    void friendSelect(){
        this.friendSelected = true;
    }

  void deselect(){
    this.selected = false;
  }
  
  void move(float x, float y){
    this.x = x;
    this.y = y;
  }


}

void movePostIt(int id, int x, int y){
    PostIt postit = (PostIt) postits.get(id);
    postit.move(x, y);
}

void createPostIt(){
    PostIt postit = postits.get(9999);
    javaScript.onNewPostit(postit.x, postit.y, postit.feed);
    postits.remove(9999);
}

void mousePressed(){
    if(selectedPostIt!=null){
        deselectCurrentPostit();
        trySelectingPostit();
        return;
    }

    if (createPendingPostit()){
        createPostIt();
    }else{
        trySelectingPostit();
        if(selectedPostIt==null)
            addPostIt(9999, "Write text...", mouseX, mouseY);
    }
}

void trySelectingPostit(){
    postit = searchFirstHovered();
    if (postit!=null){
        selectPostit(postit);
    }
}

void selectPostit(PostIt postit){
    postit.select();
    javaScript.onPostitSelected(postit.id);
    selectedPostIt = postit;
}

void friendSelectPostit(int postitId){
    PostIt postit = (PostIt) postits.get(postitId);
    postit.friendSelect();
}

void deselectCurrentPostit(){
    selectedPostIt.deselect();
    selectedPostIt = null;
}

boolean createPendingPostit(){
    return postits.containsKey(9999);
}

void mouseDragged(){
    Iterator i = postits.entrySet().iterator();
    postit = searchFirstSelected();
    if(postit!=null){
        postit.move(mouseX - postit.postit_i.width/2, mouseY - postit.postit_i.height/2);
        javaScript.onPostitMoved(postit.id, postit.x, postit.y);
    }
}

void keyPressed(){
    if (postits.containsKey(9999)){
        PostIt postit = (PostIt) postits.get(9999);
        if( ((key>='A')&&(key<='Z')) || ((key>='a')&&(key<='z')) || ((key>='0')&&(key<='9')) || (key == ' ')){
          postit.feed = concat(postit.feed, key);
        } 
        if(keyCode == BACKSPACE){
            postit.feed = postit.feed.substring(0, postit.feed.length() -1);
        }
    }
}

PostIt searchFirstHovered(){
    Iterator i = postits.entrySet().iterator();
    while (i.hasNext()) {
        Map.Entry entry = (Map.Entry)i.next();
        PostIt postit = (PostIt)entry.getValue();
        if (postit.hovered()){
            return postit;
        }
    }
    return null;
}

PostIt searchFirstSelected(){
    Iterator i = postits.entrySet().iterator();
    while (i.hasNext()) {
        Map.Entry entry = (Map.Entry)i.next();
        PostIt postit = (PostIt)entry.getValue();
        if (postit.selected){
            return postit;
        }
    }
    return null;
}
