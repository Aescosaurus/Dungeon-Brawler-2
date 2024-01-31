class PlayerManager
{
	constructor()
	{
		this.players = []
		
		this.ctrls = [
			new WASDControl( "W","S","A","D" ),
			new WASDControl( 38,40,37,39 ),
			new WASDControl( "I","K","J","L" ),
			new MouseControl(),
			new GamepadControl( 0,0,10 ),
			new GamepadControl( 0,1,11 )
		]
		
		this.deadPlayers = []
		
		this.maxPlayers = this.ctrls.length
		
		this.colors = [
			"white",
			"black",
			"darkturquoise",
			"slateblue",
			"darksalmon",
			"mediumseagreen"
		]
		
		this.canAdd = false
		this.canRemove = false
		
		this.enemyList = []
		this.playerBullets = []
		this.enemyBullets = []
	}
	
	Update( mouse,kbd,gpad,map,enemies,playerBullets,enemyBullets,gfx )
	{
		const playerUpdateInfo = {}
		playerUpdateInfo.mouse = mouse
		playerUpdateInfo.kbd = kbd
		playerUpdateInfo.gpad = gpad
		playerUpdateInfo.map = map
		playerUpdateInfo.enemies = enemies
		playerUpdateInfo.playerBullets = playerBullets
		playerUpdateInfo.enemyBullets = enemyBullets
		playerUpdateInfo.gfx = gfx
		
		for( const player of this.players )
		{
			player.Update( playerUpdateInfo )
			
			player.UpdateMisc()
		}
		
		const addDown = kbd.KeyDown( 187 )
		const removeDown = kbd.KeyDown( 189 )
		if( addDown && this.canAdd )
		{
			this.AddPlayer( map.Tile2WorldPos( map.GetRandEmptyTilePos() ),map )
		}
		else if( removeDown && this.canRemove )
		{
			this.RemovePlayer()
		}
		this.canAdd = !addDown
		this.canRemove = !removeDown
		
		this.CheckForGhosts()
	}
	
	Draw( gfx )
	{
		for( const player of this.players ) player.Draw( gfx )
	}
	
	AddPlayer( pos,map )
	{
		if( this.players.length < this.maxPlayers )
		{
			const playerPos = pos.Copy().Add( Vec2.One().Scale( map.tileSize / 2 ) )
			let player = null
			if( this.players.length == 0 ) player = new Knight( playerPos,this.ctrls[this.players.length] )
			else if( this.players.length == 1 ) player = new Archer( playerPos,this.ctrls[this.players.length] )
			else if( this.players.length == 2 ) player = new Player( playerPos,this.ctrls[this.players.length] )
			else if( this.players.length == 3 ) player = new Player( playerPos,this.ctrls[this.players.length] )
			else if( this.players.length == 4 ) player = new Player( playerPos,this.ctrls[this.players.length] )
			else if( this.players.length == 5 ) player = new Player( playerPos,this.ctrls[this.players.length] )
			this.players.push( player )
			
			player.SetupInfo( this.enemyList,this.playerBullets,this.players,this.enemyBullets )
			
			const lastPlayer = this.players.length - 1
			this.players[lastPlayer].col = this.colors[lastPlayer]
		}
		else
		{
			console.log( "Already at max players!" )
		}
	}
	
	RemovePlayer()
	{
		this.players.pop()
	}
	
	CheckForGhosts()
	{
		for( let i = 0; i < this.players.length; ++i )
		{
			if( this.players[i].hp <= 0 && !this.players[i].isGhost )
			{
				this.deadPlayers[i] = this.players[i]
				this.players[i] = new Ghost( this.players[i].pos.Copy(),this.ctrls[i] )
			}
		}
	}
	
	TryReviveGhosts()
	{
		// if( this.GetLivingPlayers().length != this.GetAllPlayers().length ) console.log( "no reviving allowed!" )
		
		for( let i = 0; i < this.players.length; ++i )
		{
			if( this.players[i].isGhost )
			{
				this.players[i] = this.deadPlayers[i]
				this.players[i].hp = this.players[i].maxHP
			}
		}
		
		this.deadPlayers = []
	}
	
	SetInfo( enemies,playerBullets,enemyBullets )
	{
		this.enemyList = enemies
		this.playerBullets = playerBullets
		this.enemyBullets = enemyBullets
	}
	
	GetLivingPlayers()
	{
		// return( this.players )
		const players = []
		for( const player of this.players )
		{
			if( !player.isGhost ) players.push( player )
		}
		return( players )
	}
	
	GetAllPlayers()
	{
		return( this.players )
	}
}