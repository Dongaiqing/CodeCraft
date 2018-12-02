import matplotlib.pyplot as plt
from numpy import random
import os

class generatePics():
    @staticmethod
    def randomPic(filename):
        base = random.random((1, 1))[0][0]
        print(base)
        Z = random.random((3, 3))
        # for (x, y), value in ndenumerate(Z):
        #     Z[x, y] = value/100+base

        plt.axis('off')
        plt.imshow(Z, cmap=plt.get_cmap("tab20"), interpolation='nearest')
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0,
                            hspace=0, wspace=0)
        plt.margins(0, 0)
        plt.gca().xaxis.set_major_locator(plt.NullLocator())
        plt.gca().yaxis.set_major_locator(plt.NullLocator())

        path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static/img/')
        if not os.path.exists(path):
            os.makedirs(path)
        path = os.path.join(path, filename+'.png')
        with open(path, 'w') as file:
            pass
        print(os.path.dirname(__file__), path)
        plt.savefig(path, bbox_inches='tight', pad_inches=0)
        return '/static/img/'+filename+'.png'
