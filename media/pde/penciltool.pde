class PencilTool implements Tool{

    private List lines;

    public PencilTool(List lines){
        this.lines = lines;
    }

    public void mousePressed(){

    }

    public void mouseClicked(){

    }

    public void mouseDragged(){
        lines.add(new Line(mouseX, mouseY, pmouseX, pmouseY));
        javaScript.onNewLine(mouseX, mouseY, pmouseX, pmouseY);
    }

    public void mouseReleased(){}

    public void keyPressed(){
    }
}

class Line{
    int x;
    int y;
    int x1;
    int y1;

    Line(int x, int y, int x1, int y1){
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
    }

    public void show(){
        line(x,y,x1,y1);
    }
}
