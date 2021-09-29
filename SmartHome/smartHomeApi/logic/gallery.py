from ..models import LocalImage,genId,set_to_list_dict,ImageBackground,UserConfig,User

def getFonUrl(oldindex):
    images = LocalImage.objects.all()
    images2 = images[oldindex:oldindex+30]
    end=True
    if(len(images)>oldindex+30):
        end=False
    for item in images2:
        users = item.imagebackground_set.all()
        print(users)
    dictImeges = set_to_list_dict(images2)
    print(dictImeges)
    ret = {"images":dictImeges,"end":end}
    return ret

def deleteImage(id):
    try:
        image = LocalImage.objects.get(id=id)
        back = image.imagebackground_set.all()
        for item in back:
            item.delete()
        image.delete()
        return True
    except Exception as e:
        return False

def linkbackground(data,id):
    print(data,id)
    try:
        user = User.objects.get(id=id)
        backgrounds = user.userconfig.background.all()
        image = LocalImage.objects.get(id=data["id"])
        for item in backgrounds:
            if(item.type==data["type"]):
                item.delete()
                break
        background = ImageBackground.objects.create(id=genId(ImageBackground.objects.all()),type=data["type"],image=image)
        user.userconfig.background.add(background)
        return True
    except Exception as e:
        return False
