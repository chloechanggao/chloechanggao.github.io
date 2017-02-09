import turtle
import time

from database import database, points, paths

screen = turtle.Screen()
screen.addshape('images/restplate.gif')
screen.addshape('images/choicemenu.gif')
screen.addshape('images/downtowni.gif')
screen.addshape('images/northsidei.gif')
screen.addshape('images/southsidei.gif')
screen.bgpic(picname='images/finalmap.gif')
    
speaker = turtle.Turtle()
speaker.ht()
speaker.speed(0)

printpos = turtle.Turtle()
printpos.hideturtle()
printpos.speed(0)
pointid = 115

lineturtle = turtle.Turtle()
lineturtle.hideturtle()
lineturtle.speed(0)


def drawLine(start, end, size = 1, color='black'):
    lineturtle.pensize(size)
    lineturtle.pencolor(color)
    lineturtle.up()
    lineturtle.goto(start[0],start[1])
    lineturtle.down()
    lineturtle.goto(end[0],end[1])

def displayID(x, y, myid= -1):
    global pointid
    if myid == -1:
        myid = pointid
        pointid += 1
    print('"{}":({},{}),'.format(myid, x,y))
    printpos.up()
    printpos.goto(x,y)
    printpos.write('{}'.format(myid))

def showGraph():
    #screen.textinput('aaa','sss '+str(len(database)))
    #putPlate(-400,-300,'max\'s cupcake')
    #speak('test speak 1')
    #time.sleep(3)
    #speak('test loooooooooooooooooooooooooooooooong speak')
    #time.sleep(3)
    #speak('test \n newline')
    for p in points:
        displayID(points[p][0], points[p][1], int(p))
    for p in paths:
        print(p)
        start = points[p[0]]
        end = points[p[1]]
        drawLine(start,end)

def speak(msg):
    #if len(msg) > 40:
    #    msg = msg[:40] + '\n' + msg[40:]
    speaker.clear()
    speaker.up()
    speaker.goto(-180, 260)
    speaker.write(msg, font=('Comic Sans MS', '20', 'normal'))

def putPlate(x, y, title):
    platebg = turtle.Turtle()
    platebg.shape('images/restplate.gif')
    platebg.up()
    platebg.goto(x,y)
    plate = turtle.Turtle()
    plate.up()
    plate.ht()
    plate.goto(x,y-10)
    plate.write(title, align = 'center', font=('Comic Sans MS', '15', 'normal'))
    return [plate, platebg]

def downtownclick(x,y):
    askCuisine('Downtown')
    
def northclick(x,y):
    askCuisine('North')
    
def southclick(x,y):
    askCuisine('South')  

northgate = '65'
southgate = '91'
downtowngate = '111'
direction = None
firsttime = True
def showpath(x,y):
    global firsttime
    if firsttime:
        firsttime = False
        return
    mindistance = 10000000
    minpoint = None
    for p in points:
        distance = (x-points[p][0])*(x-points[p][0])+(y-points[p][1])*(y-points[p][1])
        if distance < mindistance:
            minpoint = p
            mindistance = distance

    shortestpaths = {minpoint:[]}
    toextend = [minpoint]
    while len(toextend) > 0:
        q = toextend.pop(0)
        neighbors = []
        for w in paths:
            if q == w[0]:
                neighbors.append(w[1])
            if q == w[1]:
                neighbors.append(w[0])
        for n in neighbors:
            if n not in shortestpaths:
                toextend.append(n)
                shortestpaths[n] = shortestpaths[q][:]
                shortestpaths[n].append(n)
        if direction in shortestpaths:
            break
    previous = minpoint
    for r in shortestpaths[direction]:
        drawLine(points[previous],points[r],size=3,color='#FCC726')
        previous = r 
        
    
    
def askCuisine(location):
    global direction 
    goodrestaurant = database[:]
    goodrestaurant = [x for x in goodrestaurant if x['area'] == location]
    
    speak('OK ! Let\'s go '+location+'!\n What cuisine would you like ? ')
    cuisine = ''
    while cuisine not in ['asian','american','italian','mexican']:
        cuisine = screen.textinput('Enter cuisine','asian, american, italian or mexican')
    goodrestaurant = [x for x in goodrestaurant if x['flavor'].lower() == cuisine.lower()]
    

    
    speak('OK ! Let me find some '+cuisine+' restaurants.\n What price range do you prefer ?')
    price = -1
    while price not in [1,2,3]:
        price = screen.numinput('price','Enter 1 for $,2 for $$,or 3 for $$$.')
    goodrestaurant = [x for x in goodrestaurant if x['price'] == price]
    

    speak('What about rating ?')
    rating = -1
    while rating not in [1,2,3,4,5]:
        rating = screen.numinput('rating','Enter 1-5')
    goodrestaurant = [x for x in goodrestaurant if x['rating'] == rating]
    

    speak('Last question ! Did you bring cash ?')
    cash = 1
    while cash not in ['yes','no']:
        cash = screen.textinput('cash','enter no if you want to filter out cash-only options.')
    goodrestaurant = [x for x in goodrestaurant if x['cashonly'] == (cash.lower() == 'yes')]
    
    x = 0
    y = 0

    if location == 'South':
        x = 140
        y = -282
        direction = southgate

    if location == 'North':
        x = -20
        y = 196
        direction = northgate

    if location == 'Downtown':
        x = -407
        y = -212
        direction = downtowngate
        
    for r in goodrestaurant:
        putPlate(x,y,r['name'])
        if location == 'South':
            x = x-200
            y = y
        if location == 'Downtown':
            x = x
            y = y+80
        if location == 'North':
            x = x+200
            y = y

    speak('Click on the map to let us know your\n current location!')
    screen.onclick(None)
    screen.onclick(showpath)
    
            
    


def main():
    screen.onclick(displayID)
    #showGraph()
    speak('Hi !Where would you like to go to eat ? Click it !')
    downtowngui = turtle.Turtle()
    downtowngui.shape('images/downtowni.gif')
    downtowngui.up()
    downtowngui.speed(0)
    downtowngui.goto(-360,-300)
    downtowngui.onclick(downtownclick)
    northgui = turtle.Turtle()
    northgui.shape('images/northsidei.gif')
    northgui.up()
    northgui.speed(0)
    northgui.goto(-242,154)
    northgui.onclick(northclick)
    southgui = turtle.Turtle()
    southgui.shape('images/southsidei.gif')
    southgui.up()
    southgui.speed(0)
    southgui.goto(345,-253)
    southgui.onclick(southclick)
    screen.mainloop()
    
main()
