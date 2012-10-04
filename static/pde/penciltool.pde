class PencilTool implements Tool{

    private List lines;
    private boolean painting=false;
    private int color_line;
    private int stroke_weight;


    public PencilTool(List lines){
        this.lines = lines;
        this.color_line = 0;
        this.stroke_weight = 1;
    }

    public PencilTool(List lines, String color_line, int stroke_weight){
        this.lines = lines;
        this.color_line = unhex(color_line);
        this.stroke_weight = stroke_weight;
    }

    public void draw(){
        for(int j=0;j<lines.size();j++){
           lines.get(j).show();
        }
        if(currentTool == this && painting){
            lines.add(new Line(mouseX, mouseY, pmouseX, pmouseY, color_line, stroke_weight));
            javaScript.onCreatedLine(mouseX, mouseY, pmouseX, pmouseY, hex(color_line), stroke_weight, true);
        }
    }

    public void setColor(int color_line){
        this.color_line = color_line;
    }

    public void setStrokeWeight(int stroke_weight){
        this.stroke_weight = stroke_weight;
    }

    public void mousePressed(){
        painting = true;
    }

    public void mouseClicked(){

    }

    public void mouseDragged(){
    }

    public void mouseReleased(){
        painting = false;
    }

    public void keyPressed(){
    }
}

class Line{
    int x;
    int y;
    int x1;
    int y1;
    int stroke_w;
    int color_l;

    Line(int x, int y, int x1, int y1){
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.color_l = color(0);
        stroke_w = 2;
    }


    Line(int x, int y, int x1, int y1, int color_l, int stroke_w){
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.color_l = color_l;
        this.stroke_w = stroke_w;
    }

    public void show(){
        smooth();
        strokeWeight(stroke_w);
        stroke(color_l);
        line(x,y,x1,y1);
    }
}
