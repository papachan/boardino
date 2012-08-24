// Post-it WhiteBoard
/* @pjs preload="/media/postit.gif"; */
/* @pjs preload="/media/close.png"; */
String postit_image_url = "/media/postit.gif";
String postit_close_url = "/media/close.png";
HashMap postits;
List lines;
Tool currentTool;
PostitTool postitTool;
PencilTool pencilTool;
JavaScript javaScript;

interface JavaScript{
    void onNewPostit(float x, float y, String feed);
    void onNewLine(float x, float y, float x1, float y1);
    void onPostitMoved(int id, float x, float y);
    void onPostitReleased(int id, float x, float y);
    void onPostitSelected(int id);
    void onPostitDeselected(int id);
    void onCreatingPostit(float x, float y);
    void onDeletedPostit(int id);
    void onCreateTextPostit(int id, String feed, float x, float y);
    void onDeletedTextPostit(int id);
    void onPostitMovedText(int id, float x, float y);
}

interface Tool {
    public void draw();
    public void mouseDragged();
    public void mouseReleased();
    public void keyPressed();
    public void mousePressed();
    public void mouseClicked();
}

private void setup(){
    size(window.innerWidth, window.innerHeight);
    frameRate(15);

    postits = new HashMap();
    postitTool = new PostitTool(postits);

    lines = new ArrayList();
    pencilTool = new PencilTool(lines);

    selectPostitTool();

    loadBoard();
}

private void draw(){
    background(255,255,255);
    pencilTool.draw();
    postitTool.draw();
}

/**Processing events**/
private void mousePressed(){
    currentTool.mousePressed();
}

private void mouseClicked(){
    currentTool.mouseClicked();
}

private void mouseDragged(){
    currentTool.mouseDragged();
}

private void mouseReleased(){
    currentTool.mouseReleased();
}

private void keyPressed(){
    currentTool.keyPressed();
}
/**End of processing events**/

public void bindJavaScript(JavaScript js){
    javaScript = js;
}

public void addPostit(int id, String text, int x, int y){
    javaScript.onCreateTextPostit(id, text, x, y);
    postits.put(id, new PostIt(id, text, x, y));
}

public void addLine(int x, int y, int x1, int y1){
    lines.add(new Line(x, y, x1, y1));
}

public void deletePostit(int id){
    javaScript.onDeletedTextPostit(id);
    postits.remove(id);
}

public void addLine(int x, int y, int x1, int y1){
    lines.add(new Line(x, y, x1, y1));
}

public void movePostIt(int id, int x, int y){
    PostIt postit = (PostIt) postits.get(id);
    postit.move(x, y);
}

public void friendSelectPostit(int postitId){
    PostIt postit = (PostIt) postits.get(postitId);
    postit.friendSelect();
}

public void friendDeselectPostit(int postitId){
    PostIt postit = (PostIt) postits.get(postitId);
    if(postit!=null)
        postit.friendDeselect();
}

public void selectPostitTool(){
    currentTool = postitTool;
}

public void selectPencilTool(){
    currentTool = pencilTool;
}
