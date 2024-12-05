<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;  // استخدام التوكنات الشخصية

class User extends Model
{
    use HasFactory, HasApiTokens; // إضافة HasApiTokens للتعامل مع التوكنات

    protected $fillable = [
        'full_name',
        'email',
        'password',
        'image',
        'academy',
        'socialmedia',
    ];

    // علاقات Eloquent مع الموديلات الأخرى

    /**
     * علاقة مع نموذج Post (البوستات)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    /**
     * علاقة مع نموذج Comment (التعليقات)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * علاقة مع نموذج Like (الإعجابات)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    /**
     * علاقة مع نموذج SavedPost (البوستات المحفوظة)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function savedPosts()
    {
        return $this->hasMany(SavedPost::class);
    }

    /**
     * علاقة مع نموذج PersonalAccessToken (التوكنات الشخصية)
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function personalAccessTokens()
    {
        return $this->hasMany(PersonalAccessToken::class);
    }
}
