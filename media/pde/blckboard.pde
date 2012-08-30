// Post-it WhiteBoard
/* @pjs preload="/media/postit.gif"; */
String postit_image_url = "/media/postit.gif";
List lines;
Tool currentTool;
PostitTool postitTool;
PencilTool pencilTool;
JavaScript javaScript;

interface JavaScript{
    void onNewPostit(float x, float y, String feed);
    void onNewLine(float x, float y, float x1, float y1);
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
    size(3000, 1500);
    frameRate(15);

    postitTool = new PostitTool();

    lines = new ArrayList();
    pencilTool = new PencilTool(lines);

    selectPostitTool();

    loadBoard();
}

private void draw(){
    background(255,255,255);
    pencilTool.draw();
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

public void addLine(int x, int y, int x1, int y1, int color_l, int stroke_w){
    lines.add(new Line(x, y, x1, y1, color_l, stroke_w));
}


public void selectPostitTool(){
    currentTool = postitTool;
}

public void selectPencilTool(){
    currentTool = pencilTool;
    currentTool.setColor(0);
    currentTool.setStrokeWeight(2);
}

public void selectEraserTool(){
    currentTool = pencilTool;
    currentTool.setColor(255);
    currentTool.setStrokeWeight(20);
} 
