document.addEventListener("DOMContentLoaded", function() {

	//------------------------------------------ Model ------------------------------- //
	function TicketsWheelModel(tickets){

		this.tickets = tickets || []; //tickets list
		this.enemiesList = [];
		this.maxTickets = 5; //max count of output tickets
		this.activeTicket = 3; //start active ticket

		this.currentActiveTicket = this.activeTicket; //current ticket
		this.ticketClasses = ['first', 'second', 'active', 'fourth', 'fifth'];
		this.ticketClassStages = [ //tickets position classes
			['active', 'fourth', 'fifth', 'hidden', 'hidden'],
			['second', 'active', 'fourth', 'fifth', 'hidden'],
			['first', 'second', 'active', 'fourth', 'fifth'],
			['hidden', 'first', 'second', 'active', 'fourth'],
			['hidden', 'hidden', 'first', 'second', 'active']
		];

	}

	TicketsWheelModel.prototype.createEnemies = function(){
		var self = this;
		this.tickets.forEach(function(e, i){
			self.enemiesList.push(e.versus);
		});
	}

	//------------------------------------------ View ------------------------------- //
	function TicketsWheelView(container){

		this.container = container;

		this.ticketItemClassName = 'tickets-item';
		this.ticketsListDiv = $(this.container).find('.tickets-list')[0];

		this.firstEnemy = $('#firstEnemy');
		this.secondEnemy = $('#secondEnemy');

	}

	TicketsWheelView.prototype.wheelANewTicket = function(model){

		var model = model;
		var self = this;

		if(this.ticketsList.length < model.maxTickets){ //if elements more than max
			return false;
		}

		$(this.ticketsList).each(function(i, e){
			//replace classes of tickets for position
			$(e).attr('class', self.ticketItemClassName + ' ' + model.ticketClassStages[model.currentActiveTicket-1][i]);
			
		});

		//show enemies of current ticket
		var enemies = model.enemiesList[model.currentActiveTicket-1];
		if(enemies) {
			$(self.firstEnemy).html('<span class="fade-in">'+enemies[0]+'</span>');
			$(self.secondEnemy).html('<span class="fade-in">'+enemies[1]+'</span>');
		} else {
			$(self.firstEnemy).text('-');
			$(self.secondEnemy).text('-');
		}

	}

	TicketsWheelView.prototype.createTickets = function(model){

		var self = this;

		model.tickets.forEach(function(e, i){

			var ticketsItemText = $('<div class="tickets-item__text">')
				.append('<div class="tickets-item__text--stadium">'+ e.stadium +'</div>')
				.append('<div class="tickets-item__text--date"><span>'+ e.day +'</span> '+ e.month +'</div>')
				.append('<div class="tickets-item__text--time">'+ e.time +'</div>')
				.append('<a href="#" class="tickets-item__text--btn">Купить билет</a>');

			var hexagon = $('<div class="hexagon"><span></span></div>');

			var ticketsItem = $('<div class="'+self.ticketItemClassName + ' ' + model.ticketClassStages[model.activeTicket-1][i]+'" data-ticket-id="'+(i+1)+'">').append(
				$('<div class="tickets-item__hexagon">')
					.append($(ticketsItemText))
					.append($(hexagon))
			);

			$(ticketsItem)
				.appendTo($(self.ticketsListDiv));

		});

		return this.ticketsList = $(this.container).find('.'+this.ticketItemClassName);

	}

	//------------------------------------------ Controller ------------------------------- //

	function TicketsWheelCtrl(view, model){

		this.view = view;
		this.model = model;

		this.init(); //initialization app

		//add listeners
		this.view.container.addEventListener('wheel', this.onWheel.bind(this));
		window.addEventListener("resize", this.setSmallScreenSize.bind(this));
		this.addClickListenersToTickets($('.'+this.view.ticketItemClassName));

	}

	TicketsWheelCtrl.prototype.init = function(){

		//create tickets and enemies list
		this.view.createTickets(this.model);
		this.model.createEnemies();

		//show active ticket
		this.view.wheelANewTicket(this.model)

		//for small height screen (remove top padding)
		this.setSmallScreenSize();

		this.isAnimateFinishing = true;

	}

	TicketsWheelCtrl.prototype.addClickListenersToTickets = function(className){
		return $(className).on('click', this.onClickTicketItem.bind(this));
	}

	TicketsWheelCtrl.prototype.onWheel = function(e){

		var self = this;

		if(!this.isAnimateFinishing) //if prev animate doesn't finish
			return false;

		if(e.deltaY > 0){
			//wheel down
			if(this.model.currentActiveTicket >= 5){
				return false;
			}
			this.model.currentActiveTicket++;
		} else {
			//wheel up
			if(this.model.currentActiveTicket <= 1){
				return false;
			}
			this.model.currentActiveTicket--;
		}

		//start animate
		this.isAnimateFinishing = false;
		setTimeout(function(){ self.isAnimateFinishing = true }, 350);

		//show a new active ticket
		return this.view.wheelANewTicket(this.model);

	}

	TicketsWheelCtrl.prototype.setSmallScreenSize = function(e){
		//for small height screen (remove top padding)

		if(window.innerHeight < 680){
			this.view.container.classList.add("small-screen-size");
		} else {
			this.view.container.classList.remove("small-screen-size");
		}

	}

	TicketsWheelCtrl.prototype.onClickTicketItem = function(e){

		if(!e.currentTarget)
			return false;

		var ticket = e.currentTarget;
		var id = $(ticket).attr('data-ticket-id');

		if(+id){

			this.model.currentActiveTicket = +id;
			this.view.wheelANewTicket(this.model);

		}

	}

	//------------------------------------------ inint ------------------------------- //

	var tickets = [ //tickets list (get from backend)
		{
			id: 1,
			day: '30',
			month: 'Сентября',
			time: '14:30',
			stadium: 'Стадион',
			versus: ['Соперник №1', 'Соперник №2']
		},
		{
			id: 2,
			day: '16',
			month: 'Июля',
			time: '18:00',
			stadium: 'ВЭБ Арена',
			versus: ['ПФК ЦСКА', 'Зенит']
		},
		{
			id: 3,
			day: '26',
			month: 'Июня',
			time: '19:00',
			stadium: 'Стадион',
			versus: ['Соперник №1', 'Соперник №2']
		},
		{
			id: 4,
			day: '17',
			month: 'Июня',
			time: '10:30',
			stadium: 'Казань арена',
			versus: ['Урал', 'Рубин']
		},
		{
			id: 5,
			day: '30',
			month: 'Мая',
			time: '14:30',
			stadium: 'Стадион',
			versus: ['Соперник №1', 'Соперник №2']
		}
	];

	var ticketsScrollWrap = document.getElementById('ticketsScroll'); //main wrapper

	if(ticketsScrollWrap && tickets){

		//inintialization
		var ticketsWheelCtrl = new TicketsWheelCtrl(new TicketsWheelView(ticketsScrollWrap), new TicketsWheelModel(tickets));

	}

});
