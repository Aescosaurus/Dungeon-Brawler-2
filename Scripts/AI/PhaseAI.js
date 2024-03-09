class PhasePattern
{
	Reset() {}
}

class PhaseShotPattern extends ShotPattern
{
	constructor( nShots = 1,shotAng = 15,autoAng = false,angleOffset = 0,
		shotSpd = -1,shotRange = -1 )
	{
		super( nShots,shotAng,autoAng,angleOffset )
		
		this.shotSpd = shotSpd
		this.shotRange = shotRange
	}
}

class PhaseSprayPattern extends SprayPattern
{
	constructor( shotPattern,rotSpd,shotInterval,shotCount,
		shotSpd = -1,shotRange = -1 )
	{
		super( shotPattern,rotSpd,shotInterval,shotCount )
		
		this.shotSpd = shotSpd
		this.shotRange = shotRange
	}
}

class PhaseAttackPattern extends PhasePattern
{
	constructor( phaseShotPatternList,refire = -1,targetAI = TargetFinder.FindClosest )
	{
		super()
		
		this.shotPatternList = phaseShotPatternList
		if( refire > -1 ) this.refire = new Timer( refire )
		this.targetAI = targetAI
		
		this.done = false
	}
	
	Update( self,info )
	{
		if( this.done ) return
		
		if( !this.refire || this.refire.Update() )
		{
			if( this.refire ) this.refire.Reset()
			else this.done = true
			
			let target = this.targetAI( self,info.players )
			if( target == null ) target = { pos: info.map.Tile2WorldPos(
				info.map.GetRandTilePos() ) }
			
			for( const shotPattern of this.shotPatternList )
			{
				const angs = shotPattern.GetShotAngles( self.pos,target.pos )
				const spd = shotPattern.shotSpd > -1 ? shotPattern.shotSpd : self.bulletSpd
				const range = shotPattern.shotRange > -1 ? shotPattern.shotRange : self.bulletRange
				for( const ang of angs )
				{
					self.FireBullet( ang,info,spd,range )
				}
			}
		}
	}
	
	Reset()
	{
		if( this.refire ) this.refire.Reset()
		this.done = false
	}
}

class PhaseAttackPatternSpray extends PhasePattern
{
	constructor( phaseSprayPattern,refire = -1,targetAI = TargetFinder.Up )
	{
		super()
		
		this.sprayPattern = phaseSprayPattern
		if( refire > -1 ) this.refire = new Timer( refire )
		this.targetAI = targetAI
		
		this.done = false
		
		this.targetPos = null
	}
	
	Update( self,info )
	{
		if( this.done ) return( true )
		
		if( this.targetPos == null )
		{
			let target = this.targetAI( self,info.players )
			if( target == null ) target = { pos: info.map.Tile2WorldPos(
				info.map.GetRandTilePos() ) }
			this.targetPos = target.pos.Copy()
		}
		
		const result = this.sprayPattern.Update( self.pos,this.targetPos )
		if( result )
		{
			if( result.done )
			{
				this.done = true
				this.targetPos = null
			}
			else
			{
				let spd = this.sprayPattern.shotSpd
				if( !spd || spd < 0 ) spd = self.bulletSpd
				
				let range = this.sprayPattern.shotRange
				if( !range || range < 0 ) range = self.bulletRange
				
				for( const ang of result.angs ) self.FireBullet( ang,info,spd,range )
			}
		}
		
		if( this.refire && this.refire.Update() )
		{
			this.refire.Reset()
			this.sprayPattern.Reset()
			this.done = false
		}
		
		return( false )
	}
	
	Reset()
	{
		if( this.refire ) this.refire.Reset()
		this.done = false
	}
}

class Phase
{
	// dur = how long phase lasts
	// count = how many times to repeat phase
	// countWait = how long to wait before restarting phase
	constructor( moveAI,spd,attackPatternList,dur = -1,count = 1,countWait = 0 )
	{
		this.moveAI = moveAI ? moveAI : new StandStillAI()
		this.moveSpd = spd
		this.attackPatternList = attackPatternList
		if( dur < 0 )
		{
			let longest = 0
			let hasSpray = false
			for( const pattern of attackPatternList )
			{
				if( pattern.sprayPattern )
				{
					const sprayDur = pattern.sprayPattern.GetDur()
					if( sprayDur > longest ) longest = sprayDur
					hasSpray = true
				}
			}
			
			if( !hasSpray ) console.log( "Must specify dur for phase without PhaseSprayPattern in attackPatternList!" )
			else dur = longest
		}
		this.timer = new Timer( dur )
		this.counter = new Counter( count )
		this.countWait = new Timer( countWait,true )
	}
	
	Update( self,info )
	{
		if( !this.countWait.Update() ) return( false )
		
		self.aiMove = this.moveAI.GetMove( self,info )
		self.TryMove( self.aiMove.Copy().Scale( this.moveSpd ),info.map )
		
		for( const attack of this.attackPatternList ) attack.Update( self,info )
		
		if( this.timer.Update() )
		{
			this.timer.Reset()
			this.countWait.Reset()
			
			for( const pattern of this.attackPatternList ) pattern.Reset()
			
			this.moveAI.Reset()
			self.aiMove = Vec2.Zero()
			
			if( this.counter.Tick() )
			{
				return( true )
			}
		}
		
		return( false )
	}
	
	Reset()
	{
		this.timer.Reset()
		this.counter.Reset()
		this.countWait.Finish()
		
		for( const pattern of this.attackPatternList ) pattern.Reset()
	}
}

class WaitPhase extends Phase
{
	constructor( waitDur )
	{
		super( null,0,[],waitDur,1 )
	}
	
	Update( self,info )
	{
		if( this.timer.Update() )
		{
			this.timer.Reset()
			return( true )
		}
		return( false )
	}
}

class PhaseAI
{
	constructor( phases )
	{
		this.phases = phases
		
		this.phaseCounter = new Counter( this.phases.length )
	}
	
	Update( self,info )
	{
		const curPhase = this.phases[this.phaseCounter.GetCurItem()]
		if( curPhase.Update( self,info ) )
		{
			curPhase.Reset()
			if( this.phaseCounter.Tick() ) this.phaseCounter.Reset()
		}
		
		return( this.phaseCounter.GetCurItem() )
	}
	
	GotoNextPhase()
	{
		this.phaseCounter.Tick()
	}
}