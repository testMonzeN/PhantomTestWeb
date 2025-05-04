from django.db import models



class ClanMember(models.Model):
    name = models.CharField(max_length=255)
    surnames = models.CharField(max_length=255, help_text='Список псевдонимов через запятую', blank=True)

    about = models.TextField()

    role = models.ForeignKey('Role', on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class LinksMember(models.Model):
    PLATFORMS = [
        ('telegram', 'Telegram'),
        ('discord', 'Discord'), 
        ('funpay', 'FunPay'),
        ('guns_lol', 'Guns.lol'),
        ('fakebio', 'FakeBio'),
        ('github', 'GitHub'),
        ('gitlab', 'GitLab'),
        ('other', 'Other Site')
    ]

    member = models.ForeignKey(ClanMember, on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=20, choices=PLATFORMS)
    url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def icon(self):
        icons = {
            'telegram': 'fa-telegram',
            'discord': 'fa-discord',
            'funpay': 'fa-shopping-cart',
            'guns_lol': 'fa-gun',
            'fakebio': 'fa-address-card',
            'github': 'fa-github',
            'gitlab': 'fa-gitlab',
            'other': 'fa-link'
        }
        return icons.get(self.platform, 'fa-link')

    def __str__(self):
        return f"{self.get_platform_display()} link for {self.member.name}"


class Role(models.Model):
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7, help_text='HEX цвет роли (например, #FF0000)', default='#FFFFFF')

    COLORS = [
        ('#FF0000', 'Красный'),
        ('#00FF00', 'Зеленый'),
        ('#0000FF', 'Синий'),
        ('#FFFF00', 'Желтый'),
        ('#FF00FF', 'Пурпурный'),
        ('#00FFFF', 'Голубой'),
        ('#FFFFFF', 'Белый'),
        ('#000000', 'Черный'),
        ('#808080', 'Серый'),
        ('#FFA500', 'Оранжевый'),
        ('#800080', 'Фиолетовый'),
        ('#008000', 'Темно-зеленый'),
    ]
    
    color = models.CharField(
        max_length=7,
        choices=COLORS,
        default='#FFFFFF',
    )
    
    #color = models.CharField(max_length=7, choices=COLORS, default='#FFFFFF', help_text='Выберите цвет роли')
    def __str__(self):
        return self.name
